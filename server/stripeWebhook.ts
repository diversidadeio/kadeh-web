import { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { adCampaigns } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";
import { sendClientConfirmationEmail, sendAdminNotificationEmail, PaymentConfirmationData } from "./_core/emailService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Webhook handler para eventos do Stripe
 * Processa pagamentos confirmados e atualiza o status da campanha
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Detectar eventos de teste
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Processar checkout.session.completed
 * Atualiza o status da campanha para "active" após pagamento confirmado
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Processing checkout.session.completed:", session.id);

  const campaignId = session.metadata?.campaign_id;
  const userId = session.metadata?.user_id;

  if (!campaignId || !userId) {
    console.error("Missing campaign_id or user_id in session metadata");
    return;
  }

  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Buscar dados da campanha
    const campaign = await db
      .select()
      .from(adCampaigns)
      .where(eq(adCampaigns.id, parseInt(campaignId)))
      .limit(1);

    if (!campaign || campaign.length === 0) {
      console.error(`Campaign ${campaignId} not found`);
      return;
    }

    const campaignData = campaign[0];

    // Atualizar status da campanha para "active"
    await db
      .update(adCampaigns)
      .set({
        status: "active",
        stripeSessionId: session.id,
      })
      .where(eq(adCampaigns.id, parseInt(campaignId)));

    console.log(`[Webhook] Campaign ${campaignId} activated after payment`);

    // Preparar dados para envio de emails
    const emailData: PaymentConfirmationData = {
      campaignId: campaignData.id,
      companyName: campaignData.companyName,
      contactEmail: campaignData.contactEmail,
      productName: campaignData.productName,
      duration: campaignData.duration,
      numberOfStores: campaignData.numberOfStores,
      totalCost: parseFloat(campaignData.totalCost.toString()),
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      stripeSessionId: session.id,
    };

    // Enviar emails de confirmação
    const clientEmailSent = await sendClientConfirmationEmail(emailData);
    const adminEmailSent = await sendAdminNotificationEmail(emailData);

    if (!clientEmailSent || !adminEmailSent) {
      console.warn("[Webhook] One or more confirmation emails failed to send");
    }

    // Notificar o proprietário
    await notifyOwner({
      title: "Novo Pagamento de Campanha Kadeh Ads",
      content: `Uma nova campanha foi paga e ativada. ID: ${campaignId}, Usuário: ${userId}, Valor: ${session.amount_total ? (session.amount_total / 100).toFixed(2) : "N/A"}`,
    });
  } catch (error: any) {
    console.error("Error updating campaign status:", error);
    throw error;
  }
}

/**
 * Processar payment_intent.succeeded
 * Fallback para atualizar status se checkout.session.completed não for acionado
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Webhook] Processing payment_intent.succeeded:", paymentIntent.id);

  const campaignId = paymentIntent.metadata?.campaign_id;

  if (!campaignId) {
    console.log("No campaign_id in payment_intent metadata, skipping");
    return;
  }

  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Atualizar status da campanha para "active"
    await db
      .update(adCampaigns)
      .set({
        status: "active",
        stripePaymentIntentId: paymentIntent.id,
      })
      .where(eq(adCampaigns.id, parseInt(campaignId)));

    console.log(`[Webhook] Campaign ${campaignId} activated after payment intent`);
  } catch (error: any) {
    console.error("Error updating campaign status:", error);
    throw error;
  }
}

/**
 * Processar charge.refunded
 * Atualizar status da campanha se houver reembolso
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("[Webhook] Processing charge.refunded:", charge.id);

  const campaignId = charge.metadata?.campaign_id;

  if (!campaignId) {
    console.log("No campaign_id in charge metadata, skipping");
    return;
  }

  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Atualizar status da campanha para "refunded"
    await db
      .update(adCampaigns)
      .set({
        status: "refunded",
      })
      .where(eq(adCampaigns.id, parseInt(campaignId)));

    console.log(`[Webhook] Campaign ${campaignId} marked as refunded`);

    // Notificar o proprietário
    await notifyOwner({
      title: "Reembolso de Campanha Kadeh Ads",
      content: `Uma campanha foi reembolsada. ID: ${campaignId}, Valor: ${charge.amount ? (charge.amount / 100).toFixed(2) : "N/A"}`,
    });
  } catch (error: any) {
    console.error("Error updating campaign status:", error);
    throw error;
  }
}

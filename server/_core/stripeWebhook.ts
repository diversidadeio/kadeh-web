import Stripe from "stripe";
import { Request, Response } from "express";
import { getDb } from "../db";
import { adCampaigns, stripePayments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Handle Stripe webhook events
 * This endpoint processes payment confirmations and updates campaign status
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Stripe Webhook] Payment intent succeeded:", paymentIntent.id);

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  try {
    const metadata = paymentIntent.metadata as Record<string, string>;
    const campaignId = metadata.campaign_id;
    const userEmail = metadata.customer_email;
    const userName = metadata.customer_name;

    if (!campaignId) {
      console.error("[Stripe Webhook] No campaign_id in metadata");
      return;
    }

    // Update campaign status to 'approved'
    await db
      .update(adCampaigns)
      .set({
        status: "approved",
        updatedAt: new Date(),
      })
      .where(eq(adCampaigns.id, parseInt(campaignId)));

    // Record the payment
    await db.insert(stripePayments).values({
      paymentIntentId: paymentIntent.id,
      campaignId: parseInt(campaignId),
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: "succeeded",
      metadata: JSON.stringify(metadata),
      createdAt: new Date(),
    });

    // Send notification to owner
    await notifyOwner({
      title: "Novo Pagamento Recebido - Kadeh Ads",
      content: `Pagamento de R$ ${(paymentIntent.amount / 100).toFixed(2)} recebido de ${userName} (${userEmail}). Campanha ID: ${campaignId}. Status: Aprovada.`,
    });

    console.log("[Stripe Webhook] Campaign updated and notifications sent");
  } catch (error) {
    console.error("[Stripe Webhook] Error handling payment success:", error);
    throw error;
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Stripe Webhook] Payment intent failed:", paymentIntent.id);

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  try {
    const metadata = paymentIntent.metadata as Record<string, string>;
    const campaignId = metadata.campaign_id;

    if (!campaignId) {
      console.error("[Stripe Webhook] No campaign_id in metadata");
      return;
    }

    // Update campaign status to 'rejected'
    await db
      .update(adCampaigns)
      .set({
        status: "rejected",
        updatedAt: new Date(),
      })
      .where(eq(adCampaigns.id, parseInt(campaignId)));

    // Record the failed payment
    await db.insert(stripePayments).values({
      paymentIntentId: paymentIntent.id,
      campaignId: parseInt(campaignId),
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: "failed",
      metadata: JSON.stringify(metadata),
      createdAt: new Date(),
    });

    console.log("[Stripe Webhook] Campaign rejected due to payment failure");
  } catch (error) {
    console.error("[Stripe Webhook] Error handling payment failure:", error);
    throw error;
  }
}

/**
 * Handle checkout session completion
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("[Stripe Webhook] Checkout session completed:", session.id);

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  try {
    const metadata = session.metadata as Record<string, string>;
    const campaignId = metadata.campaign_id;

    if (!campaignId) {
      console.error("[Stripe Webhook] No campaign_id in metadata");
      return;
    }

    // Update campaign status to 'pending_approval'
    await db
      .update(adCampaigns)
      .set({
        status: "pending_approval",
        stripeSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(eq(adCampaigns.id, parseInt(campaignId)));

    console.log("[Stripe Webhook] Campaign status updated to pending_approval");
  } catch (error) {
    console.error("[Stripe Webhook] Error handling checkout session:", error);
    throw error;
  }
}

import { Router } from "express";
import Stripe from "stripe";
import { getDb } from "../db";
import { advertisements, adPayments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const router = Router();

const getStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not configured");
  }
  return new Stripe(apiKey);
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Webhook para processar eventos do Stripe
 * Atualiza status de pagamento e ativa campanhas quando pagamento é confirmado
 */
router.post("/webhook", async (req, res) => {
  const db = await getDb();
  if (!db) {
    return res.status(503).json({ error: "Database not available" });
  }
  const sig = req.headers["stripe-signature"] as string;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return res.status(400).json({ error: "Webhook secret not configured" });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    ) as Stripe.Event;
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session, db);
        break;
      }

      case "charge.succeeded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeSucceeded(charge, db);
        break;
      }

      case "charge.failed": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeFailed(charge, db);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge, db);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Processa checkout completado - Cria registro de pagamento
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, db?: any) {
  if (!db) {
    db = await getDb();
    if (!db) return;
  }
  const advertisementId = session.metadata?.advertisementId;
  const stripePaymentIntentId = session.payment_intent as string;

  if (!advertisementId || !stripePaymentIntentId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  try {
    // Buscar anúncio
    const ad = await db.query.advertisements.findFirst({
      where: eq(advertisements.id, parseInt(advertisementId)),
    });

    if (!ad) {
      console.error(`Advertisement not found: ${advertisementId}`);
      return;
    }

    // Criar registro de pagamento
    await db.insert(adPayments).values({
      advertisementId: parseInt(advertisementId),
      stripePaymentIntentId,
      amount: ad.totalCost,
      currency: "BRL",
      status: "pending", // Será atualizado quando charge.succeeded for disparado
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`Payment record created for advertisement ${advertisementId}`);
  } catch (err) {
    console.error("Error handling checkout session completed:", err);
  }
}

/**
 * Processa cobrança bem-sucedida - Ativa anúncio
 */
async function handleChargeSucceeded(charge: Stripe.Charge, db?: any) {
  if (!db) {
    db = await getDb();
    if (!db) return;
  }
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    console.error("Missing payment_intent in charge");
    return;
  }

  try {
    // Buscar pagamento
    const payment = await db.query.adPayments.findFirst({
      where: eq(adPayments.stripePaymentIntentId, paymentIntentId),
    });

    if (!payment) {
      console.error(`Payment not found for intent: ${paymentIntentId}`);
      return;
    }

    // Atualizar status do pagamento
    await db
      .update(adPayments)
      .set({
        status: "succeeded",
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(adPayments.id, payment.id));

    // Ativar anúncio
    const now = new Date();
    await db
      .update(advertisements)
      .set({
        status: "active",
        startDate: now,
        updatedAt: now,
      })
      .where(eq(advertisements.id, payment.advertisementId));

    console.log(`Advertisement ${payment.advertisementId} activated after successful payment`);
  } catch (err) {
    console.error("Error handling charge succeeded:", err);
  }
}

/**
 * Processa cobrança falhada - Marca pagamento como falho
 */
async function handleChargeFailed(charge: Stripe.Charge, db?: any) {
  if (!db) {
    db = await getDb();
    if (!db) return;
  }
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    console.error("Missing payment_intent in charge");
    return;
  }

  try {
    // Buscar pagamento
    const payment = await db.query.adPayments.findFirst({
      where: eq(adPayments.stripePaymentIntentId, paymentIntentId),
    });

    if (!payment) {
      console.error(`Payment not found for intent: ${paymentIntentId}`);
      return;
    }

    // Atualizar status do pagamento
    await db
      .update(adPayments)
      .set({
        status: "failed",
        updatedAt: new Date(),
      })
      .where(eq(adPayments.id, payment.id));

    // Marcar anúncio como falha no pagamento
    await db
      .update(advertisements)
      .set({
        status: "pending_payment",
        updatedAt: new Date(),
      })
      .where(eq(advertisements.id, payment.advertisementId));

    console.log(`Payment failed for advertisement ${payment.advertisementId}`);
  } catch (err) {
    console.error("Error handling charge failed:", err);
  }
}

/**
 * Processa reembolso - Marca pagamento como reembolsado
 */
async function handleChargeRefunded(charge: Stripe.Charge, db?: any) {
  if (!db) {
    db = await getDb();
    if (!db) return;
  }
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    console.error("Missing payment_intent in charge");
    return;
  }

  try {
    // Buscar pagamento
    const payment = await db.query.adPayments.findFirst({
      where: eq(adPayments.stripePaymentIntentId, paymentIntentId),
    });

    if (!payment) {
      console.error(`Payment not found for intent: ${paymentIntentId}`);
      return;
    }

    // Atualizar status do pagamento
    await db
      .update(adPayments)
      .set({
        status: "refunded",
        refundedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(adPayments.id, payment.id));

    // Cancelar anúncio
    await db
      .update(advertisements)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(advertisements.id, payment.advertisementId));

    console.log(`Advertisement ${payment.advertisementId} cancelled after refund`);
  } catch (err) {
    console.error("Error handling charge refunded:", err);
  }
}

export default router;

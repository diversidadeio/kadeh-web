import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe client - will be available when STRIPE_SECRET_KEY is configured
const getStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not configured");
  }
  return new Stripe(apiKey);
  // Note: apiVersion is optional and defaults to the latest version
};

export const stripeRouter = router({
  /**
   * Create a Stripe Checkout session for ad payment
   * Requires authentication
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        campaignName: z.string().min(1, "Campaign name is required"),
        productName: z.string().min(1, "Product name is required"),
        amount: z.number().min(100, "Amount must be at least 1.00"),
        currency: z.string().default("BRL"),
        duration: z.number().min(1, "Duration is required"),
        stores: z.number().min(1, "At least 1 store is required"),
        advertiserId: z.string().min(1, "Advertiser ID is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const stripe = getStripeClient();
        // Create checkout session
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
          line_items: [
            {
              price_data: {
                currency: input.currency.toLowerCase(),
                product_data: {
                  name: input.campaignName,
                  description: `${input.productName} - ${input.duration} days in ${input.stores} store(s)`,
                  metadata: {
                    advertiserId: input.advertiserId,
                    duration: input.duration.toString(),
                    stores: input.stores.toString(),
                  },
                },
                unit_amount: Math.round(input.amount * 100), // Convert to cents
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/pt/advertiser-portal?session_id={CHECKOUT_SESSION_ID}&status=success`,
          cancel_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/pt/advertiser-portal?status=cancel`,
          customer_email: ctx.user?.email || undefined,
          metadata: {
            advertiserId: input.advertiserId,
            userId: ctx.user?.id || "",
          },
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("Stripe checkout error:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  /**
   * Retrieve checkout session details
   */
  getCheckoutSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const stripe = getStripeClient();
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        return {
          id: session.id,
          status: session.payment_status,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
          currency: session.currency,
          metadata: session.metadata,
        };
      } catch (error) {
        console.error("Stripe session retrieval error:", error);
        throw new Error("Failed to retrieve session");
      }
    }),

  /**
   * Get payment intent details
   */
  getPaymentIntent: publicProcedure
    .input(z.object({ intentId: z.string() }))
    .query(async ({ input }) => {
      try {
        const stripe = getStripeClient();
        const intent = await stripe.paymentIntents.retrieve(input.intentId);
        return {
          id: intent.id,
          status: intent.status,
          amount: intent.amount,
          currency: intent.currency,
          clientSecret: intent.client_secret,
        };
      } catch (error) {
        console.error("Payment intent retrieval error:", error);
        throw new Error("Failed to retrieve payment intent");
      }
    }),
});

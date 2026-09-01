import Stripe from "stripe";
import { getBaseUrl, siteConfig } from "@/lib/config";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-08-27.basil",
    });
  }

  return stripeClient;
}

export async function createCheckoutSession(input: {
  email: string;
  firstName?: string;
}) {
  const stripe = getStripeClient();
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return {
      url: null,
      reason: !stripe ? "missing_stripe_secret_key" : "missing_stripe_price_id",
    };
  }

  const baseUrl = getBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: input.email,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: false,
    billing_address_collection: "auto",
    consent_collection: {
      terms_of_service: "required",
    },
    custom_fields: [
      {
        key: "first_name",
        label: { type: "custom", custom: "First name" },
        type: "text",
        text: {
          minimum_length: 1,
          maximum_length: 50,
        },
        optional: true,
      },
    ],
    metadata: {
      source: "market-this-morning-site",
      offer: "first-month-free",
      firstName: input.firstName ?? "",
    },
    subscription_data: {
      trial_period_days: siteConfig.trialDays,
      metadata: {
        source: "market-this-morning-site",
      },
    },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
  });

  return { url: session.url, reason: null };
}

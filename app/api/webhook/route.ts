import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import {
  addPaidAudienceContact,
  removePaidAudienceContact,
} from "@/lib/marketing";

export const runtime = "nodejs";

async function emailFromSubscription(
  stripe: Stripe,
  subscription: Stripe.Subscription,
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;
  if (!customerId) return null;
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  return customer.email ?? null;
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid webhook signature.",
      },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription") {
          const email =
            session.customer_details?.email ??
            session.customer_email ??
            null;
          if (email) {
            await addPaidAudienceContact({
              email,
              firstName: session.metadata?.firstName || undefined,
            });
          }
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const email = await emailFromSubscription(stripe, subscription);
        if (email) {
          await removePaidAudienceContact(email);
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Webhook handler failed.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

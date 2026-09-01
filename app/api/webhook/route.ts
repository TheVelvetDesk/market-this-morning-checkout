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
  return {
    email: customer.email ?? null,
    firstName: customer.name?.trim().split(/\s+/)[0] || undefined,
  };
}

function isMarketBriefSubscription(subscription: Stripe.Subscription) {
  const priceId = process.env.STRIPE_PRICE_ID;
  return !priceId || subscription.items.data.some((item) => item.price.id === priceId);
}

function subscriptionIsEntitled(subscription: Stripe.Subscription) {
  return isMarketBriefSubscription(subscription) && ["active", "trialing"].includes(subscription.status);
}

async function customerHasEntitlement(stripe: Stripe, customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 100,
  });
  return subscriptions.data.some(subscriptionIsEntitled);
}

async function syncSubscriptionEntitlement(stripe: Stripe, subscription: Stripe.Subscription) {
  if (!isMarketBriefSubscription(subscription)) return;
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  if (!customerId) return;
  const identity = await emailFromSubscription(stripe, subscription);
  if (!identity?.email) return;
  const email = identity.email;
  const entitled = await customerHasEntitlement(stripe, customerId);
  if (entitled) {
    await addPaidAudienceContact({ email, firstName: identity.firstName });
  } else {
    await removePaidAudienceContact(email);
  }
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
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriptionEntitlement(stripe, subscription);
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

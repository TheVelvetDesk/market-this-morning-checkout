import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

type SubscribeBody = {
  email?: string;
  firstName?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: SubscribeBody;

  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const firstName = body.firstName?.trim() ?? "";

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }

  try {
    const session = await createCheckoutSession({ email, firstName });

    if (!session.url) {
      return NextResponse.json(
        {
          error:
            "Checkout is not configured yet. Add Stripe keys and a recurring 10 USD/month price ID to enable subscriptions.",
          reason: session.reason,
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to start checkout.",
      },
      { status: 500 },
    );
  }
}

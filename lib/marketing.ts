import { Resend } from "resend";

type MarketingSignup = {
  email: string;
  firstName?: string;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return {
      client: null as Resend | null,
      audienceId: null as string | null,
      reason: !apiKey ? "missing_resend_api_key" : "missing_resend_audience_id",
    };
  }
  return { client: new Resend(apiKey), audienceId, reason: null as string | null };
}

/** Add paid subscriber to Resend audience market-this-morning-paid after checkout. */
export async function addPaidAudienceContact({
  email,
  firstName,
}: MarketingSignup) {
  const { client, audienceId, reason } = getResendClient();
  if (!client || !audienceId) {
    return { skipped: true as const, reason: reason ?? "missing_config" };
  }

  const { error } = await client.contacts.create({
    audienceId,
    email,
    firstName,
    unsubscribed: false,
  });

  // Ignore duplicate / validation conflicts so webhook retries stay idempotent.
  if (error && !/already|exists|duplicate/i.test(error.message)) {
    throw new Error(error.message);
  }

  return { skipped: false as const };
}

/** Remove or unsubscribe canceled members from the paid audience. */
export async function removePaidAudienceContact(email: string) {
  const { client, audienceId, reason } = getResendClient();
  if (!client || !audienceId) {
    return { skipped: true as const, reason: reason ?? "missing_config" };
  }

  const { error } = await client.contacts.remove({
    audienceId,
    email,
  });

  if (error) {
    // Fallback: mark unsubscribed if hard remove is unavailable.
    const update = await client.contacts.update({
      audienceId,
      email,
      unsubscribed: true,
    });
    if (update.error) {
      throw new Error(update.error.message || error.message);
    }
  }

  return { skipped: false as const };
}

/** @deprecated Prefer webhook-driven addPaidAudienceContact */
export async function syncMarketingContact(input: MarketingSignup) {
  return addPaidAudienceContact(input);
}

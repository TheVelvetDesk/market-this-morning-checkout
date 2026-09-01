type MarketingSignup = {
  email: string;
  firstName?: string;
};

type SheetAction = "add" | "remove";

type ResendResult = { skipped: boolean; reason?: string };

async function resendRequest(path: string, init: RequestInit, allowNotFound = false) {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_PAID_SEGMENT_ID;
  if (!apiKey || !segmentId) {
    return { skipped: true, reason: "missing_resend_paid_segment_config" } as ResendResult;
  }

  const response = await fetch(`https://api.resend.com${path.replace("{segmentId}", encodeURIComponent(segmentId))}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "market-this-morning-checkout/0.1",
      ...(init.headers ?? {}),
    },
  });

  if (allowNotFound && response.status === 404) return { skipped: false } as ResendResult;
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend contact sync failed (${response.status}): ${text.slice(0, 240)}`);
  }
  return { skipped: false } as ResendResult;
}

async function addToPaidSegment({ email, firstName }: MarketingSignup) {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_PAID_SEGMENT_ID;
  if (!apiKey || !segmentId) return { skipped: true, reason: "missing_resend_paid_segment_config" } as ResendResult;

  const create = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "market-this-morning-checkout/0.1",
    },
    body: JSON.stringify({
      email,
      ...(firstName ? { properties: { first_name: firstName } } : {}),
      segments: [{ id: segmentId }],
    }),
  });

  // An existing contact is expected on resubscribe. Add the segment idempotently.
  if (create.ok) return { skipped: false } as ResendResult;
  if (create.status !== 409) {
    const text = await create.text();
    throw new Error(`Resend contact creation failed (${create.status}): ${text.slice(0, 240)}`);
  }
  return resendRequest(
    `/contacts/${encodeURIComponent(email)}/segments/{segmentId}`,
    { method: "POST" },
  );
}

async function removeFromPaidSegment(email: string) {
  return resendRequest(
    `/contacts/${encodeURIComponent(email)}/segments/{segmentId}`,
    { method: "DELETE" },
    true,
  );
}

async function callSheetBridge(payload: {
  action: SheetAction;
  email: string;
  firstName?: string;
}) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    return { skipped: true as const, reason: "missing_google_sheets_webhook_url" };
  }

  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: payload.action,
      email: payload.email,
      firstName: payload.firstName ?? "",
      secret: secret ?? "",
    }),
  });

  const text = await response.text();
  let parsed: { ok?: boolean; error?: string } = {};
  try {
    parsed = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    parsed = {};
  }

  if (!response.ok || parsed.ok === false) {
    throw new Error(
      parsed.error ||
        `Google Sheet bridge failed (${response.status}): ${text.slice(0, 200)}`,
    );
  }

  return { skipped: false as const };
}

/** Add an entitled subscriber to the Resend paid segment and audit sheet. */
export async function addPaidAudienceContact({
  email,
  firstName,
}: MarketingSignup) {
  const resend = await addToPaidSegment({ email, firstName });
  const sheet = await callSheetBridge({ action: "add", email, firstName });
  return { resend, sheet };
}

/** Remove a non-entitled subscriber from the paid segment and audit sheet. */
export async function removePaidAudienceContact(email: string) {
  const resend = await removeFromPaidSegment(email);
  const sheet = await callSheetBridge({ action: "remove", email });
  return { resend, sheet };
}

/** @deprecated Prefer webhook-driven addPaidAudienceContact */
export async function syncMarketingContact(input: MarketingSignup) {
  return addPaidAudienceContact(input);
}

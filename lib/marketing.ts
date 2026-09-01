type MarketingSignup = {
  email: string;
  firstName?: string;
};

type SheetAction = "add" | "remove";

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

/** Add paid subscriber to the Google Sheet paid list after checkout. */
export async function addPaidAudienceContact({
  email,
  firstName,
}: MarketingSignup) {
  return callSheetBridge({ action: "add", email, firstName });
}

/** Mark canceled members on the Google Sheet paid list. */
export async function removePaidAudienceContact(email: string) {
  return callSheetBridge({ action: "remove", email });
}

/** @deprecated Prefer webhook-driven addPaidAudienceContact */
export async function syncMarketingContact(input: MarketingSignup) {
  return addPaidAudienceContact(input);
}

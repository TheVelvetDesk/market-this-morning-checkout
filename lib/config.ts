const defaultPromoEnd = "2026-09-03T06:59:59.000Z"; // ~3 days from Aug 31 PT

function resolvePromoEnd() {
  const raw = process.env.NEXT_PUBLIC_PROMO_ENDS_AT ?? defaultPromoEnd;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date(defaultPromoEnd) : parsed;
}

export const siteConfig = {
  name: "Market This Morning",
  priceLabel: "$10/mo",
  priceCents: 1000,
  headline: "Weekday US-market morning brief — before the cash open",
  promoEnd: resolvePromoEnd(),
  trialDays: 30,
};

export function formatPromoDate() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  }).format(siteConfig.promoEnd);
}

export function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000"
  );
}

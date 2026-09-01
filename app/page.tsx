import { BoardCard } from "@/components/board-card";
import { PromoCountdown } from "@/components/promo-countdown";
import { SignupForm } from "@/components/signup-form";
import { formatPromoDate, siteConfig } from "@/lib/config";

const picks = [
  {
    ticker: "CVX",
    company: "Chevron",
    why: "Energy tape with a dated catalyst and real premarket volume behind the move.",
    risk: "Crude fades after the open and the stock loses sector confirmation.",
    tone: "up" as const,
  },
  {
    ticker: "XOM",
    company: "Exxon Mobil",
    why: "Group sympathy and a clean liquidity setup make it a straightforward continuation candidate.",
    risk: "Oil rolls over and relative strength disappears by midday.",
    tone: "up" as const,
  },
  {
    ticker: "DAL",
    company: "Delta Air Lines",
    why: "Event-driven airline setup with enough range to work in either direction.",
    risk: "The calendar item underdelivers and price compresses into noise.",
    tone: "swing" as const,
  },
  {
    ticker: "INTC",
    company: "Intel",
    why: "Chip name reacting to its own print instead of hiding behind broad mega-cap flows.",
    risk: "Buyers reclaim the prior close and squeeze weak shorts off the first hour.",
    tone: "down" as const,
  },
];

const faqs = [
  {
    q: "When does the brief arrive?",
    a: "Weekday mornings before the US cash open — a picks-first PDF you can scan in minutes.",
  },
  {
    q: "What does the promo include?",
    a: "For this 3-day window, new subscribers get the first month free (30-day Stripe trial), then $10/month. Cancel anytime before the trial ends and you will not be charged.",
  },
  {
    q: "Is this trading advice?",
    a: "No. Market This Morning is an informational morning brief with a tracked scorecard — not a crystal ball and not personalized investment advice.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from Stripe customer portal / billing email. No annual lock-in.",
  },
  {
    q: "What is the scorecard?",
    a: "We track how the framed ideas behave after publication. Transparency over hype — past results do not predict future results.",
  },
];

export default function HomePage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl border-t-4 border-crimson pt-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div>
              <p className="text-base font-bold uppercase tracking-[0.25em] text-crimson">
                {siteConfig.name}
              </p>
              <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                {siteConfig.headline}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-700">
                Picks-first weekday brief before the open. Tracked scorecard —
                not a crystal ball. First month free during this promo, then
                $10/mo. Cancel anytime.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-2 w-24 rounded-full bg-crimson" />
              <h2 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
                Sample picks framing
              </h2>
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
                Illustrative only — not a live recommendation
              </p>
            </div>

            <div className="space-y-5">
              {picks.map((pick) => (
                <BoardCard key={pick.ticker} {...pick} />
              ))}
            </div>
          </div>

          <aside id="subscribe" className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[2rem] border border-stone-300/80 bg-white/85 p-6 shadow-card backdrop-blur sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-crimson">
                Subscriber Access
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-ink">
                First month free, then $10 a month.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-stone-700">
                Weekday morning brief before cash open. Cancel anytime — no
                annual contract.
              </p>

              <div className="mt-6 space-y-4 rounded-[1.5rem] border border-stone-300 bg-paper/80 p-5">
                <PromoCountdown endsAt={siteConfig.promoEnd.toISOString()} />
                <p className="font-serif text-xl font-semibold text-ink">
                  Offer ends {formatPromoDate()} (PT).
                </p>
                <p className="text-sm leading-relaxed text-stone-700">
                  Checkout starts a 30-day Stripe trial. Pay nothing today.
                  Billing begins at $10/month after the trial unless you cancel
                  first.
                </p>
              </div>

              <div className="mt-8">
                <SignupForm />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="font-serif text-3xl font-bold text-ink">What you get</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Picks-first PDF", "Ticker, direction framing (UP / DOWN / SWING), why today, and wrong-if — before the open."],
            ["Tracked scorecard", "Ideas are logged and reviewed. Transparency over hype — not a crystal ball."],
            ["Weekday cadence", "US cash-session mornings. Built for desks that need a fast, honest brief."],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-3xl border border-stone-300/80 bg-white/70 p-6 shadow-card"
            >
              <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-stone-700 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto mt-16 max-w-6xl">
        <h2 className="font-serif text-3xl font-bold text-ink">FAQ</h2>
        <div className="mt-6 divide-y divide-stone-300 rounded-3xl border border-stone-300/80 bg-white/70">
          {faqs.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="cursor-pointer list-none font-serif text-xl font-semibold text-ink">
                {item.q}
              </summary>
              <p className="mt-3 text-stone-700 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl rounded-[2rem] border border-crimson/20 bg-crimson/5 p-8 text-center">
        <h2 className="font-serif text-3xl font-bold text-ink">
          Ready for tomorrow&apos;s open?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-stone-700">
          First month free during the 3-day promo, then $10/mo. Cancel anytime.
        </p>
        <a
          href="#subscribe"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-crimson px-8 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-red-700"
        >
          Start free trial
        </a>
      </section>

      <footer className="mx-auto mt-16 max-w-6xl border-t border-stone-300 py-10 text-sm leading-relaxed text-stone-600">
        <p className="font-semibold text-stone-800">Disclaimer</p>
        <p className="mt-2">
          Market This Morning is for informational and educational purposes only.
          Nothing here is trading, investment, tax, or legal advice. We do not
          recommend buying or selling any security. Markets involve risk. Past
          performance is not indicative of future results. You are solely
          responsible for your own decisions.
        </p>
        <p className="mt-4 text-stone-500">
          © {new Date().getFullYear()} {siteConfig.name}. $10/mo after free
          trial. Cancel anytime.
        </p>
      </footer>
    </main>
  );
}

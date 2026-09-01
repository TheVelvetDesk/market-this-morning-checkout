import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
      <div className="w-full rounded-[2rem] border border-stone-300/80 bg-white/90 p-8 shadow-card">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-crimson">
          Subscription Started
        </p>
        <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-ink">
          You&apos;re in the trial.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">
          Stripe confirmed the checkout session and the 30-day trial is active.
          Morning access starts immediately, and the subscription converts to
          $10 per month after the trial unless you cancel beforehand.
        </p>
        <div className="mt-8">
          <Link
            className="inline-flex rounded-full bg-crimson px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
            href="/"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

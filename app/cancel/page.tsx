import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
      <div className="w-full rounded-[2rem] border border-stone-300/80 bg-white/90 p-8 shadow-card">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-crimson">
          Checkout Canceled
        </p>
        <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-ink">
          No charge. No subscription.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">
          The trial wasn&apos;t started. You can return to the offer any time
          before September 2, 2026 to claim the first month free promotion.
        </p>
        <div className="mt-8">
          <Link
            className="inline-flex rounded-full bg-crimson px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
            href="/"
          >
            Return to Offer
          </Link>
        </div>
      </div>
    </main>
  );
}

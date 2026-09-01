"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function PromoCountdown({ endsAt }: { endsAt: string }) {
  const end = new Date(endsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = Math.max(0, end - now);
  const expired = remaining <= 0;
  const totalSec = Math.floor(remaining / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return (
    <div className="rounded-[1.25rem] border border-crimson/30 bg-crimson/5 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-crimson">
        {expired ? "Promo window closed" : "3-day promo — ends in"}
      </p>
      {!expired ? (
        <p className="mt-2 font-serif text-2xl font-semibold tabular-nums text-ink">
          {days}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
        </p>
      ) : (
        <p className="mt-2 text-sm text-stone-700">
          Standard plan: $10/month. Cancel anytime.
        </p>
      )}
    </div>
  );
}

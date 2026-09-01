import clsx from "clsx";

type Tone = "up" | "swing" | "down";

const toneClasses: Record<Tone, string> = {
  up: "border-l-teal bg-teal/5 text-teal",
  swing: "border-l-amber bg-amber/5 text-amber",
  down: "border-l-crimson bg-crimson/5 text-crimson",
};

const badgeLabel: Record<Tone, string> = {
  up: "↑ UP",
  swing: "↔ SWING",
  down: "↓ DOWN",
};

export function BoardCard(props: {
  ticker: string;
  company: string;
  why: string;
  risk: string;
  tone: Tone;
}) {
  return (
    <article className="rounded-[1.7rem] border border-stone-300/80 bg-white/80 p-6 shadow-card backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="font-serif text-4xl font-bold tracking-tight text-ink">
              {props.ticker}
            </h3>
            <p className="font-serif text-2xl font-semibold text-stone-600">
              {props.company}
            </p>
          </div>
          <div className="mt-4 space-y-2 text-lg leading-relaxed text-stone-800">
            <p>
              <span className="font-semibold text-ink">Why today:</span>{" "}
              {props.why}
            </p>
            <p>
              <span className="font-semibold text-ink">Wrong if:</span>{" "}
              {props.risk}
            </p>
          </div>
        </div>
        <div
          className={clsx(
            "inline-flex items-center rounded-full border-l-4 px-5 py-3 text-lg font-bold tracking-wide",
            toneClasses[props.tone],
          )}
        >
          {badgeLabel[props.tone]}
        </div>
      </div>
    </article>
  );
}

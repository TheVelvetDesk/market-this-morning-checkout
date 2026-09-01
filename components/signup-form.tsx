"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "error";

export function SignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: String(formData.get("firstName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as
        | { url?: string; error?: string }
        | undefined;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error ?? "Unable to start checkout.");
      }

      window.location.assign(data.url);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
    }
  }

  return (
    <form
      className="grid gap-4 rounded-[2rem] border border-stone-300/80 bg-white/85 p-6 shadow-card backdrop-blur sm:grid-cols-[1fr_1.2fr_auto] sm:items-end"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-2 text-sm font-medium text-stone-700">
        First name
        <input
          className="h-12 rounded-full border border-stone-300 bg-paper px-4 text-base text-ink outline-none transition focus:border-crimson"
          name="firstName"
          placeholder="Taylor"
          type="text"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-stone-700">
        Email
        <input
          required
          className="h-12 rounded-full border border-stone-300 bg-paper px-4 text-base text-ink outline-none transition focus:border-crimson"
          name="email"
          placeholder="you@desk.com"
          type="email"
        />
      </label>
      <button
        className="h-12 rounded-full bg-crimson px-6 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={status === "loading"}
        type="submit"
      >
        {status === "loading" ? "Loading..." : "Start Free Trial"}
      </button>
      <div className="sm:col-span-3">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
          First month free for signups before the promo closes. Then $10/month.
          Cancel anytime.
        </p>
        {status === "error" ? (
          <p className="mt-2 text-sm text-crimson">{errorMessage}</p>
        ) : null}
      </div>
    </form>
  );
}

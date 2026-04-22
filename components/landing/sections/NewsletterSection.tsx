"use client";

import { FormEvent, useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Unable to subscribe.");
        return;
      }

      setMessage(data.message ?? "Subscribed successfully.");
      setEmail("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-12 md:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="pixel-frame bg-[#3a86ff] px-6 py-12 text-center text-white md:px-10 lg:px-16">
          <h2 className="section-title text-3xl md:text-4xl">Get product updates and launch tips.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-white/95 md:text-base">
            Join the newsletter for learning strategy, feature releases, and real creator playbooks.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto mt-7 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="pixel-input h-12 flex-1 px-4 text-sm font-semibold text-black placeholder:text-black/55 outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="pixel-btn h-12 bg-[#ffbe0b] px-6 text-sm text-black disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Subscribe"}
            </button>
          </form>
          {error ? <p className="mt-3 text-sm font-semibold text-[#ffd6d6]">{error}</p> : null}
          {message ? <p className="mt-3 text-sm font-semibold text-[#caffbf]">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}

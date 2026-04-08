import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import type { NewsletterSource } from "@mealvana/shared";

interface NewsletterFormProps {
  source: NewsletterSource;
  className?: string;
}

export function NewsletterForm({ source, className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const subscribe = useMutation(api.newsletter.subscribe);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await subscribe({ email: email.trim(), source });
      toast.success("You're subscribed! Check your inbox for fueling tips.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-orange px-8 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
    </form>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { ViewportFade } from "@/components/viewport-fade";
import { useState } from "react";
import { toast } from "sonner";
import type { DiscussionCategory } from "@mealvana/shared";

const CATEGORIES: Array<{ label: string; value: DiscussionCategory }> = [
  { label: "General", value: "general" },
  { label: "Nutrition", value: "nutrition" },
  { label: "Training", value: "training" },
  { label: "App", value: "app" },
  { label: "Race Reports", value: "race-reports" },
];

export const Route = createFileRoute("/community/new")({
  head: () => ({
    meta: [{ title: "New Discussion | Mealvana Endurance Community" }],
  }),
  component: NewDiscussion,
});

function NewDiscussion() {
  const navigate = useNavigate();
  const createDiscussion = useMutation(api.discussions.create);
  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "general" as DiscussionCategory,
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;

    setSubmitting(true);
    try {
      const id = await createDiscussion({
        title: form.title.trim(),
        body: form.body.trim(),
        category: form.category,
      });
      navigate({ to: `/community/${id}` });
    } catch {
      toast.error("Failed to create discussion. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <ViewportFade>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Start a Discussion
        </h1>
        <p className="mt-2 text-muted-foreground">
          Share your thoughts, questions, or race reports with the community.
        </p>
      </ViewportFade>

      <ViewportFade>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What's on your mind?"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as DiscussionCategory,
                })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="body"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Body
            </label>
            <textarea
              id="body"
              required
              rows={8}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Share your thoughts..."
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !form.title.trim() || !form.body.trim()}
            className="rounded-full bg-orange px-8 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Discussion"}
          </button>
        </form>
      </ViewportFade>
    </div>
  );
}

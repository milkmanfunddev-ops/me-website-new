import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { ViewportFade } from "@/components/viewport-fade";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@clerk/tanstack-react-start";
import { MessageSquare, Plus, Pin } from "lucide-react";
import type { DiscussionCategory } from "@mealvana/shared";

const CATEGORIES: Array<{ label: string; value: DiscussionCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "General", value: "general" },
  { label: "Nutrition", value: "nutrition" },
  { label: "Training", value: "training" },
  { label: "App", value: "app" },
  { label: "Race Reports", value: "race-reports" },
];

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Community | Mealvana Endurance" },
      {
        name: "description",
        content:
          "Join the Mealvana Endurance community. Discuss nutrition, training, and race strategies.",
      },
    ],
  }),
  component: CommunityIndex,
});

function CommunityIndex() {
  const { isSignedIn } = useAuth();
  const [category, setCategory] = useState<DiscussionCategory | "all">("all");

  const discussions = useQuery(api.discussions.list, {
    category: category === "all" ? undefined : category,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <ViewportFade>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold text-foreground">
              Community
            </h1>
            <p className="mt-2 text-muted-foreground">
              Discuss nutrition strategies, share race reports, and learn from
              fellow athletes.
            </p>
          </div>
          {isSignedIn && (
            <Link
              to="/community/new"
              className="flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 font-heading text-sm font-bold text-white transition-colors hover:bg-orange-dark"
            >
              <Plus className="h-4 w-4" />
              New Discussion
            </Link>
          )}
        </div>
      </ViewportFade>

      <ViewportFade>
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat.value
                  ? "bg-blackberry text-cream"
                  : "border border-border text-muted-foreground hover:bg-cream-dark"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </ViewportFade>

      <div className="mt-8 space-y-3">
        {discussions?.map((discussion) => (
          <ViewportFade key={discussion._id}>
            <Link
              to="/community/$discussionId"
              params={{ discussionId: discussion._id }}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {discussion.isPinned && (
                    <Pin className="h-3.5 w-3.5 text-orange" />
                  )}
                  <h2 className="font-heading font-bold text-foreground hover:text-orange">
                    {discussion.title}
                  </h2>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {discussion.body.slice(0, 200)}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  {discussion.author && (
                    <span className="font-medium">{discussion.author.name}</span>
                  )}
                  <span>{formatDate(discussion._creationTime as unknown as string)}</span>
                  <span className="rounded-full bg-cream-dark px-2 py-0.5">
                    {discussion.category}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{discussion.replyCount}</span>
              </div>
            </Link>
          </ViewportFade>
        ))}

        {discussions && discussions.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <p className="mt-4 text-lg">No discussions yet.</p>
            {isSignedIn ? (
              <Link
                to="/community/new"
                className="mt-4 inline-block text-orange hover:underline"
              >
                Start the first discussion
              </Link>
            ) : (
              <Link
                to="/sign-in"
                className="mt-4 inline-block text-orange hover:underline"
              >
                Sign in to start a discussion
              </Link>
            )}
          </div>
        )}

        {!discussions && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl border border-border bg-cream-dark/50"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { ViewportFade } from "@/components/viewport-fade";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@clerk/tanstack-react-start";
import { toast } from "sonner";
import {
  ArrowLeft,
  MessageSquare,
  Lock,
  Pin,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/community/$discussionId")({
  head: () => ({
    meta: [{ title: "Discussion | Mealvana Endurance Community" }],
  }),
  component: DiscussionPage,
});

function DiscussionPage() {
  const { discussionId } = Route.useParams();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const discussion = useQuery(api.discussions.get, {
    id: discussionId as Id<"discussions">,
  });
  const replies = useQuery(api.discussions.listReplies, {
    discussionId: discussionId as Id<"discussions">,
  });
  const currentUser = useQuery(api.users.getCurrent);

  const replyMutation = useMutation(api.discussions.reply);
  const updateDiscussion = useMutation(api.discussions.update);
  const removeDiscussion = useMutation(api.discussions.remove);

  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingDiscussion, setEditingDiscussion] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [savingDiscussion, setSavingDiscussion] = useState(false);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyBody.trim()) return;

    setSubmitting(true);
    try {
      await replyMutation({
        discussionId: discussionId as Id<"discussions">,
        body: replyBody.trim(),
      });
      setReplyBody("");
    } catch {
      toast.error("Failed to post reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function startEditDiscussion() {
    if (!discussion) return;
    setEditTitle(discussion.title);
    setEditBody(discussion.body);
    setEditingDiscussion(true);
  }

  async function saveEditDiscussion() {
    if (!discussion) return;
    if (!editTitle.trim() || !editBody.trim()) return;
    setSavingDiscussion(true);
    try {
      await updateDiscussion({
        id: discussion._id,
        title: editTitle.trim(),
        body: editBody.trim(),
      });
      setEditingDiscussion(false);
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setSavingDiscussion(false);
    }
  }

  async function handleDeleteDiscussion() {
    if (!discussion) return;
    if (!confirm("Delete this topic and all its replies? This cannot be undone.")) return;
    try {
      await removeDiscussion({ id: discussion._id });
      navigate({ to: "/community" });
    } catch {
      toast.error("Failed to delete topic.");
    }
  }

  if (!discussion) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-cream-dark/50" />
          <div className="h-4 w-full animate-pulse rounded bg-cream-dark/50" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-cream-dark/50" />
        </div>
      </div>
    );
  }

  const isDiscussionOwner =
    !!currentUser && currentUser._id === discussion.authorId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ViewportFade>
        <Link
          to="/community"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Link>

        <div className="flex items-center gap-2">
          {discussion.isPinned && <Pin className="h-4 w-4 text-orange" />}
          {discussion.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          <span className="rounded-full bg-cream-dark px-3 py-0.5 text-xs font-medium text-muted-foreground">
            {discussion.category}
          </span>
        </div>

        {editingDiscussion ? (
          <div className="mt-3 space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 font-heading text-2xl font-bold outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={saveEditDiscussion}
                disabled={savingDiscussion || !editTitle.trim() || !editBody.trim()}
                className="inline-flex items-center gap-1.5 rounded-full bg-orange px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                {savingDiscussion ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditingDiscussion(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-cream-dark"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">
              {discussion.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {discussion.author && (
                <span className="font-medium text-foreground">
                  {discussion.author.name}
                </span>
              )}
              <span>{formatDate(discussion._creationTime as unknown as string)}</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {discussion.replyCount} replies
              </span>
              {isDiscussionOwner && (
                <span className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startEditDiscussion}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-cream-dark hover:text-foreground"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteDiscussion}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </span>
              )}
            </div>

            <div className="mt-6 whitespace-pre-wrap leading-relaxed text-foreground">
              {discussion.body}
            </div>
          </>
        )}
      </ViewportFade>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Replies ({replies?.length || 0})
        </h2>

        <div className="mt-6 space-y-4">
          {replies?.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              currentUserId={currentUser?._id}
            />
          ))}
        </div>

        {!discussion.isLocked ? (
          isSignedIn ? (
            <form onSubmit={handleReply} className="mt-8">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Write a reply..."
                rows={4}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
              />
              <button
                type="submit"
                disabled={submitting || !replyBody.trim()}
                className="mt-3 rounded-full bg-orange px-6 py-2.5 font-heading text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post Reply"}
              </button>
            </form>
          ) : (
            <div className="mt-8 rounded-xl border border-border bg-cream-dark/50 p-6 text-center">
              <p className="text-muted-foreground">
                <Link to="/sign-in" className="text-orange hover:underline">
                  Sign in
                </Link>{" "}
                to join the discussion.
              </p>
            </div>
          )
        ) : (
          <div className="mt-8 rounded-xl border border-border bg-cream-dark/50 p-6 text-center">
            <Lock className="mx-auto h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              This discussion has been locked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

type ReplyWithAuthor = {
  _id: Id<"discussionReplies">;
  _creationTime: number;
  authorId: Id<"users">;
  body: string;
  isEdited: boolean;
  author?: { name?: string } | null;
};

function ReplyItem({
  reply,
  currentUserId,
}: {
  reply: ReplyWithAuthor;
  currentUserId: Id<"users"> | undefined;
}) {
  const updateReply = useMutation(api.discussions.updateReply);
  const removeReply = useMutation(api.discussions.removeReply);

  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(reply.body);
  const [saving, setSaving] = useState(false);

  const isOwner = !!currentUserId && currentUserId === reply.authorId;

  async function save() {
    if (!body.trim()) return;
    setSaving(true);
    try {
      await updateReply({ id: reply._id, body: body.trim() });
      setEditing(false);
    } catch {
      toast.error("Failed to save reply.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this reply? This cannot be undone.")) return;
    try {
      await removeReply({ id: reply._id });
    } catch {
      toast.error("Failed to delete reply.");
    }
  }

  return (
    <ViewportFade>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-medium text-foreground">
            {reply.author?.name || "Anonymous"}
          </span>
          <span className="text-muted-foreground">
            {formatDate(reply._creationTime as unknown as string)}
          </span>
          {reply.isEdited && (
            <span className="text-xs text-muted-foreground">(edited)</span>
          )}
          {isOwner && !editing && (
            <span className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setBody(reply.body);
                  setEditing(true);
                }}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-cream-dark hover:text-foreground"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </span>
          )}
        </div>

        {editing ? (
          <div className="mt-3 space-y-3">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={save}
                disabled={saving || !body.trim()}
                className="inline-flex items-center gap-1.5 rounded-full bg-orange px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-cream-dark"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-foreground">
            {reply.body}
          </p>
        )}
      </div>
    </ViewportFade>
  );
}

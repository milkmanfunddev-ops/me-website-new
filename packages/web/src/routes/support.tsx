import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "@/lib/sanity";
import { ViewportFade } from "@/components/viewport-fade";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { CONTACT_EMAIL } from "@mealvana/shared";
import { Mail, MessageSquare, ChevronDown } from "lucide-react";

const getTopFaqs = createServerFn({ method: "GET" }).handler(async () => {
  return sanityClient.fetch(`
    *[_type == "faq" && isPublished == true && category == "General"] | order(orderRank asc) [0...5] {
      _id, question, answer
    }
  `);
});

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support | Mealvana Endurance" },
      {
        name: "description",
        content: "Get help with Mealvana Endurance. Contact our team or browse FAQs.",
      },
    ],
  }),
  loader: () => getTopFaqs(),
  component: SupportPage,
});

function SupportPage() {
  const topFaqs = Route.useLoaderData() as Array<{
    _id: string;
    question: string;
  }>;

  const submitContact = useMutation(api.contact.submit);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setLoading(true);
    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || "General Inquiry",
        message: form.message.trim(),
      });
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <ViewportFade>
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Support
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          We're here to help. Send us a message or check the FAQs below.
        </p>
      </ViewportFade>

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ViewportFade>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-orange" />
                <h2 className="font-heading text-xl font-bold">
                  Send us a message
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-orange px-8 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </ViewportFade>
        </div>

        <div className="lg:col-span-2">
          <ViewportFade>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange" />
                <h2 className="font-heading text-lg font-bold">
                  Email us directly
                </h2>
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-orange hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </ViewportFade>

          {topFaqs && topFaqs.length > 0 && (
            <ViewportFade>
              <div className="mt-6 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-heading text-lg font-bold">
                  Common Questions
                </h2>
                <div className="space-y-2">
                  {topFaqs.map((faq) => (
                    <button
                      key={faq._id}
                      type="button"
                      onClick={() =>
                        setOpenFaq(openFaq === faq._id ? null : faq._id)
                      }
                      className="flex w-full items-center justify-between text-left text-sm text-foreground hover:text-orange"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`ml-2 h-3 w-3 shrink-0 transition-transform ${
                          openFaq === faq._id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Link
                  to="/faq"
                  className="mt-4 inline-block text-sm text-orange hover:underline"
                >
                  View all FAQs
                </Link>
              </div>
            </ViewportFade>
          )}
        </div>
      </div>
    </div>
  );
}

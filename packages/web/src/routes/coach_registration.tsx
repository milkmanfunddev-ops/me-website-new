import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Mail,
  Users,
  Sparkles,
} from "lucide-react";
import { ViewportFade } from "@/components/viewport-fade";
import { APP_NAME, CONTACT_EMAIL } from "@mealvana/shared";

export const Route = createFileRoute("/coach_registration")({
  head: () => ({
    meta: [
      { title: `Coach Registration | ${APP_NAME}` },
      {
        name: "description",
        content:
          "Apply to coach with Mealvana Endurance. Science-based nutrition planning for the athletes you train — running, cycling, triathlon, and beyond.",
      },
      { property: "og:title", content: `Coach Registration | ${APP_NAME}` },
      {
        property: "og:description",
        content:
          "Apply to coach with Mealvana Endurance. Manage athlete nutrition plans alongside your training programs.",
      },
    ],
  }),
  component: CoachRegistrationPage,
});

type PracticeType =
  | "running"
  | "cycling"
  | "triathlon"
  | "swimming"
  | "dietitian"
  | "other";

const PRACTICE_OPTIONS: Array<{ value: PracticeType; label: string }> = [
  { value: "running", label: "Running coach" },
  { value: "cycling", label: "Cycling coach" },
  { value: "triathlon", label: "Triathlon coach" },
  { value: "swimming", label: "Swimming coach" },
  { value: "dietitian", label: "Endurance dietitian / RD" },
  { value: "other", label: "Something else" },
];

const ATHLETE_COUNT_OPTIONS = [
  "Just me / planning to start",
  "1–5",
  "6–15",
  "16–30",
  "30+",
];

const PERKS = [
  {
    icon: Users,
    title: "Manage your roster",
    body: "View training, nutrition adherence, and race readiness across every athlete you coach — in one place.",
  },
  {
    icon: Sparkles,
    title: "AI-built fueling plans",
    body: "Generate science-based pre-, during-, and post-workout nutrition for each athlete with one click.",
  },
  {
    icon: Award,
    title: "Free during beta",
    body: "No coach subscription fees while we onboard our founding cohort. Lock in early-access pricing later.",
  },
];

function CoachRegistrationPage() {
  const submit = useMutation(api.coaches.apply);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    practiceType: "" as PracticeType | "",
    certifications: "",
    athleteCount: "",
    websiteOrSocial: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.practiceType ||
      !form.certifications.trim()
    ) {
      toast.error("Please complete the required fields.");
      return;
    }

    setLoading(true);
    try {
      await submit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        practiceType: form.practiceType as PracticeType,
        certifications: form.certifications.trim(),
        athleteCount: form.athleteCount.trim() || undefined,
        websiteOrSocial: form.websiteOrSocial.trim() || undefined,
        message: form.message.trim() || undefined,
      });
      setSubmitted(true);
      toast.success("Application sent! Check your inbox.");
    } catch {
      toast.error("Something went wrong. Please try again or email us.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
        <ViewportFade>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="bg-blackberry px-8 py-12 text-center text-cream">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange/20">
                <CheckCircle2 className="h-9 w-9 text-orange" />
              </div>
              <h1 className="mt-6 font-heading text-3xl font-bold">
                You're on the list.
              </h1>
              <p className="mt-3 text-cream/80">
                Thanks for applying to coach with {APP_NAME}.
              </p>
            </div>
            <div className="space-y-4 px-8 py-8 text-sm leading-relaxed text-foreground">
              <p>
                We onboard coaches manually during beta, so a real person will
                review your application and reach out within a few business
                days.
              </p>
              <p>
                Once approved, you'll get a coach account on{" "}
                <a
                  href="https://app.mealvana.io"
                  className="font-medium text-orange hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  app.mealvana.io
                </a>{" "}
                with full athlete management.
              </p>
              <p className="text-muted-foreground">
                Questions in the meantime? Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-orange hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </ViewportFade>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-blackberry text-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-electrolyte/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <ViewportFade>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              Coach beta — free during onboarding
            </div>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Coach with{" "}
              <span className="text-orange">Mealvana Endurance</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-cream/80 sm:text-xl">
              Bring science-based nutrition to every athlete on your roster.
              Apply below — we onboard each coach personally during beta.
            </p>
          </ViewportFade>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <ViewportFade>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/10">
                    <ClipboardList className="h-5 w-5 text-orange" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">
                      Coach application
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Takes about 90 seconds. Required fields marked with *.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id="name"
                      label="Full name *"
                      value={form.name}
                      onChange={(v) => update("name", v)}
                      required
                      autoComplete="name"
                    />
                    <Field
                      id="email"
                      label="Email *"
                      type="email"
                      value={form.email}
                      onChange={(v) => update("email", v)}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id="phone"
                      label="Phone (optional)"
                      type="tel"
                      value={form.phone}
                      onChange={(v) => update("phone", v)}
                      autoComplete="tel"
                    />
                    <div>
                      <Label htmlFor="practiceType">Practice *</Label>
                      <select
                        id="practiceType"
                        required
                        value={form.practiceType}
                        onChange={(e) =>
                          update("practiceType", e.target.value as PracticeType)
                        }
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {PRACTICE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="certifications">
                      Certifications or credentials *
                    </Label>
                    <input
                      id="certifications"
                      type="text"
                      required
                      value={form.certifications}
                      onChange={(e) =>
                        update("certifications", e.target.value)
                      }
                      placeholder="e.g. USAT Level 1, RRCA, RD, CSSD, ACE"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Short and rough is fine — we'll confirm details when we
                      reach out.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="athleteCount">
                        Athletes you coach today
                      </Label>
                      <select
                        id="athleteCount"
                        value={form.athleteCount}
                        onChange={(e) =>
                          update("athleteCount", e.target.value)
                        }
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
                      >
                        <option value="">Optional</option>
                        {ATHLETE_COUNT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Field
                      id="websiteOrSocial"
                      label="Website or @handle"
                      value={form.websiteOrSocial}
                      onChange={(v) => update("websiteOrSocial", v)}
                      placeholder="optional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Anything else? (optional)</Label>
                    <textarea
                      id="message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Sports you specialize in, what you hope to use Mealvana for, athletes preparing for a specific race…"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-8 py-3.5 font-heading text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-dark hover:shadow-md disabled:opacity-50 disabled:hover:bg-orange sm:w-auto"
                  >
                    {loading ? "Sending…" : "Submit application"}
                  </button>

                  <p className="text-xs text-muted-foreground">
                    We'll review and reach out personally. No spam — promise.
                  </p>
                </form>
              </div>
            </ViewportFade>
          </div>

          {/* Side */}
          <aside className="space-y-4 lg:col-span-2">
            <ViewportFade>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  What you get
                </h3>
                <ul className="mt-4 space-y-4">
                  {PERKS.map((perk) => (
                    <li key={perk.title} className="flex gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange/10">
                        <perk.icon className="h-4.5 w-4.5 text-orange" />
                      </div>
                      <div>
                        <p className="font-heading text-sm font-bold text-foreground">
                          {perk.title}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                          {perk.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ViewportFade>

            <ViewportFade>
              <div className="rounded-2xl border border-border bg-blackberry p-6 text-cream shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange/20">
                    <Mail className="h-4 w-4 text-orange" />
                  </div>
                  <h3 className="font-heading text-base font-bold">
                    Prefer to email?
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-cream/80">
                  Send us a note at{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-orange hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>{" "}
                  and we'll take it from there.
                </p>
              </div>
            </ViewportFade>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tiny helpers                                                       */
/* ------------------------------------------------------------------ */

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-foreground"
    >
      {children}
    </label>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
      />
    </div>
  );
}

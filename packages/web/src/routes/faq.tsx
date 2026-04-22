import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@/components/portable-text";
import { ViewportFade } from "@/components/viewport-fade";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { faqPageJsonLd } from "@/lib/structured-data";
import { portableTextToPlain } from "@/lib/portable-text-to-plain";
import type { PortableTextValue } from "@/lib/sanity-types";

const FAQ_CATEGORIES = [
  "All",
  "General",
  "Nutrition",
  "App",
  "Billing",
  "Training",
] as const;

type FaqItem = {
  _id: string;
  question: string;
  answer: PortableTextValue;
  category: string;
};

const getFaqs = createServerFn({ method: "GET" }).handler(
  async (): Promise<FaqItem[]> => {
    return sanityClient.fetch<FaqItem[]>(`
      *[_type == "faq" && isPublished == true] | order(orderRank asc) {
        _id, question, answer, category
      }
    `);
  },
);

export const Route = createFileRoute("/faq")({
  head: ({ loaderData }) => {
    const faqs = (loaderData as FaqItem[] | undefined) ?? [];
    return {
      meta: [
        { title: "FAQ | Mealvana Endurance" },
        {
          name: "description",
          content:
            "Frequently asked questions about Mealvana Endurance nutrition planning.",
        },
      ],
      scripts: faqs.length
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(
                faqPageJsonLd(
                  faqs.map((faq) => ({
                    question: faq.question,
                    answer: portableTextToPlain(faq.answer),
                  })),
                ),
              ),
            },
          ]
        : [],
    };
  },
  loader: () => getFaqs(),
  component: FaqPage,
});

function FaqPage() {
  const faqs = Route.useLoaderData() as FaqItem[];

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = faqs?.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ViewportFade>
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Everything you need to know about Mealvana Endurance.
        </p>
      </ViewportFade>

      <ViewportFade>
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-5 text-sm outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
          />
        </div>
      </ViewportFade>

      <ViewportFade>
        <div className="mt-6 flex flex-wrap gap-2">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-blackberry text-cream"
                  : "border border-border text-muted-foreground hover:bg-cream-dark"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </ViewportFade>

      <div className="mt-8 space-y-3">
        {filtered?.map((faq) => (
          <ViewportFade key={faq._id}>
            <div className="rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() =>
                  setOpenId(openId === faq._id ? null : faq._id)
                }
                className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-foreground hover:bg-cream-dark/50"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`ml-4 h-4 w-4 shrink-0 transition-transform ${
                    openId === faq._id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openId === faq._id && (
                <div className="border-t border-border px-5 py-4">
                  <PortableText value={faq.answer} />
                </div>
              )}
            </div>
          </ViewportFade>
        ))}

        {filtered?.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No questions match your search.
          </p>
        )}
      </div>
    </div>
  );
}

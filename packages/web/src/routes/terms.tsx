import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@/components/portable-text";
import { ViewportFade } from "@/components/viewport-fade";
import { formatDate } from "@/lib/utils";
import type { PortableTextValue } from "@/lib/sanity-types";

type LegalDoc = {
  _id: string;
  title: string;
  lastUpdated: string;
  body: PortableTextValue;
};

const getTerms = createServerFn({ method: "GET" }).handler(
  async (): Promise<LegalDoc | null> => {
    return sanityClient.fetch<LegalDoc | null>(`
      *[_type == "legalDoc" && slug.current == "terms-of-use"][0] {
        _id, title, lastUpdated, body
      }
    `);
  },
);

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | Mealvana Endurance" },
    ],
  }),
  loader: () => getTerms(),
  component: TermsPage,
});

function TermsPage() {
  const doc = Route.useLoaderData() as LegalDoc | null;

  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Terms of Use</h1>
        <p className="mt-4 text-muted-foreground">Content coming soon.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ViewportFade>
        <h1 className="font-heading text-4xl font-bold text-foreground">
          {doc.title}
        </h1>
        {doc.lastUpdated && (
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {formatDate(doc.lastUpdated)}
          </p>
        )}
      </ViewportFade>
      <ViewportFade>
        <div className="prose-mealvana mt-8">
          <PortableText value={doc.body} />
        </div>
      </ViewportFade>
    </div>
  );
}

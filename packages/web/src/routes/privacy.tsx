import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@/components/portable-text";
import { ViewportFade } from "@/components/viewport-fade";
import { formatDate } from "@/lib/utils";

const getPrivacyPolicy = createServerFn({ method: "GET" }).handler(async () => {
  return sanityClient.fetch(`
    *[_type == "legalDoc" && slug.current == "privacy-policy"][0] {
      _id, title, lastUpdated, body
    }
  `);
});

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Mealvana Endurance" },
    ],
  }),
  loader: () => getPrivacyPolicy(),
  component: PrivacyPage,
});

function PrivacyPage() {
  const doc = Route.useLoaderData() as {
    _id: string;
    title: string;
    lastUpdated: string;
    body: unknown[];
  } | null;

  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Privacy Policy</h1>
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

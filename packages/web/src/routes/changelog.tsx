import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@/components/portable-text";
import { ViewportFade } from "@/components/viewport-fade";
import { formatDate } from "@/lib/utils";
import type { PortableTextValue } from "@/lib/sanity-types";

type ChangelogRelease = {
  _id: string;
  version: string;
  title: string;
  releaseDate: string;
  label?: string;
  whatsNew?: PortableTextValue;
  improvements?: PortableTextValue;
  bugFixes?: PortableTextValue;
};

const getChangelog = createServerFn({ method: "GET" }).handler(
  async (): Promise<ChangelogRelease[]> => {
    return sanityClient.fetch<ChangelogRelease[]>(`
      *[_type == "changelog"] | order(releaseDate desc) {
        _id, version, title, releaseDate, label, whatsNew, improvements, bugFixes
      }
    `);
  },
);

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog | Mealvana Endurance" },
      {
        name: "description",
        content: "See what's new in the latest version of Mealvana Endurance.",
      },
    ],
  }),
  loader: () => getChangelog(),
  component: ChangelogPage,
});

function ChangelogPage() {
  const releases = Route.useLoaderData() as ChangelogRelease[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ViewportFade>
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Changelog
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          New features, improvements, and fixes in each release.
        </p>
      </ViewportFade>

      <div className="mt-12 space-y-12">
        {releases?.map((release, i) => (
          <ViewportFade key={release._id} delay={i * 0.05}>
            <article className="relative border-l-2 border-border pl-8">
              <div className="absolute -left-2 top-1 h-4 w-4 rounded-full border-2 border-orange bg-background" />
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  v{release.version}
                </h2>
                {release.label && (
                  <span className="rounded-full bg-orange/10 px-3 py-0.5 text-xs font-medium text-orange">
                    {release.label}
                  </span>
                )}
              </div>
              {release.title && (
                <p className="mt-1 text-lg text-foreground">{release.title}</p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(release.releaseDate)}
              </p>

              {release.whatsNew && release.whatsNew.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-orange">
                    What's New
                  </h3>
                  <PortableText value={release.whatsNew} />
                </div>
              )}

              {release.improvements && release.improvements.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Improvements
                  </h3>
                  <PortableText value={release.improvements} />
                </div>
              )}

              {release.bugFixes && release.bugFixes.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Bug Fixes
                  </h3>
                  <PortableText value={release.bugFixes} />
                </div>
              )}
            </article>
          </ViewportFade>
        ))}
      </div>

      {(!releases || releases.length === 0) && (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">No changelog entries yet.</p>
        </div>
      )}
    </div>
  );
}

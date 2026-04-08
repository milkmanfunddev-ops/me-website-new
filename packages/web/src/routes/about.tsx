import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient, urlFor } from "@/lib/sanity";
import { PortableText } from "@/components/portable-text";
import { ViewportFade } from "@/components/viewport-fade";
import { APP_NAME } from "@mealvana/shared";

const getTeam = createServerFn({ method: "GET" }).handler(async () => {
  return sanityClient.fetch(`
    *[_type == "teamMember"] | order(orderRank asc) {
      _id, name, slug, role, image, bio, socialLinks
    }
  `);
});

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Mealvana Endurance" },
      {
        name: "description",
        content:
          "Meet the team behind Mealvana Endurance — science-backed nutrition for endurance athletes.",
      },
    ],
  }),
  loader: () => getTeam(),
  component: AboutPage,
});

function AboutPage() {
  const team = Route.useLoaderData() as Array<{
    _id: string;
    name: string;
    slug: { current: string };
    role: string;
    image?: { asset: unknown };
    bio?: unknown[];
    socialLinks?: Array<{ platform: string; url: string }>;
  }>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <ViewportFade>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            About {APP_NAME}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            We believe every endurance athlete deserves a personalized nutrition
            plan backed by real science — not generic advice from the internet.
            {APP_NAME} combines peer-reviewed research with smart technology to
            help you fuel your best performance.
          </p>
        </div>
      </ViewportFade>

      <ViewportFade>
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Our Mission
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Endurance sports nutrition is complex. Carb loading, electrolyte
            balance, race-day fueling — the science evolves constantly and
            one-size-fits-all advice falls short. We built {APP_NAME} to put the
            latest research directly into athletes' hands, personalized to their
            sport, body, and goals.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Whether you're training for your first marathon or your twentieth
            Ironman, {APP_NAME} gives you a clear, science-backed plan so you
            can focus on what matters: the training, the racing, and the joy of
            crossing the finish line well-fueled.
          </p>
        </div>
      </ViewportFade>

      {team && team.length > 0 && (
        <>
          <ViewportFade>
            <h2 className="mt-20 text-center font-heading text-2xl font-bold text-foreground">
              Meet the Team
            </h2>
          </ViewportFade>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <ViewportFade key={member._id} delay={i * 0.05}>
                <div className="rounded-xl border border-border bg-card p-6 text-center">
                  {member.image?.asset && (
                    <img
                      src={urlFor(member.image).width(160).height(160).url()}
                      alt={member.name}
                      className="mx-auto h-24 w-24 rounded-full object-cover"
                    />
                  )}
                  <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  {member.bio && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      <PortableText value={member.bio} />
                    </div>
                  )}
                  {member.socialLinks && member.socialLinks.length > 0 && (
                    <div className="mt-3 flex justify-center gap-3">
                      {member.socialLinks.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-orange"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </ViewportFade>
            ))}
          </div>
        </>
      )}

      <ViewportFade>
        <div className="mt-20 rounded-xl bg-blackberry p-10 text-center text-cream">
          <h2 className="font-heading text-2xl font-bold">
            Ready to fuel smarter?
          </h2>
          <p className="mt-2 text-cream/70">
            Join thousands of endurance athletes using {APP_NAME}.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-orange px-8 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-orange-dark"
          >
            Get Started
          </Link>
        </div>
      </ViewportFade>
    </div>
  );
}

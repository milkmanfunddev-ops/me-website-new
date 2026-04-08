import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import { ViewportFade } from "@/components/viewport-fade";

const getBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  return sanityClient.fetch(`
    *[_type == "blogPost" && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      readTime,
      publishedAt,
      featuredImage,
      tags,
      "author": author->{name, slug, avatar},
      "categories": categories[]->{title, slug, color}
    }
  `);
});

const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  return sanityClient.fetch(`
    *[_type == "blogCategory"] | order(title asc) {
      _id,
      title,
      slug
    }
  `);
});

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog | Mealvana Endurance" },
      {
        name: "description",
        content:
          "Science-backed nutrition tips, race fueling guides, and training insights for endurance athletes.",
      },
    ],
  }),
  loader: async () => {
    const [posts, categories] = await Promise.all([
      getBlogPosts(),
      getCategories(),
    ]);
    return { posts, categories };
  },
  component: BlogIndex,
});

function BlogIndex() {
  const { posts, categories } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ViewportFade>
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Blog
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Science-backed nutrition tips, race fueling guides, and training
            insights.
          </p>
        </div>
      </ViewportFade>

      {categories?.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            to="/blog"
            className="rounded-full bg-blackberry px-4 py-1.5 text-sm font-medium text-cream"
          >
            All
          </Link>
          {categories.map(
            (cat: { _id: string; title: string; slug: { current: string } }) => (
              <Link
                key={cat._id}
                to={`/blog/category/${cat.slug.current}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-cream-dark"
              >
                {cat.title}
              </Link>
            ),
          )}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map(
          (
            post: {
              _id: string;
              title: string;
              slug: { current: string };
              excerpt: string;
              readTime: number;
              publishedAt: string;
              featuredImage?: { asset: unknown };
              author?: { name: string };
              categories?: Array<{ title: string; slug: { current: string } }>;
            },
            i: number,
          ) => (
            <ViewportFade key={post._id} delay={i * 0.05}>
              <Link
                to={`/blog/${post.slug.current}`}
                className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
              >
                {post.featuredImage?.asset && (
                  <div className="aspect-video overflow-hidden bg-cream-dark">
                    <img
                      src={urlFor(post.featuredImage).width(600).height(340).url()}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  {post.categories && post.categories.length > 0 && (
                    <div className="mb-2 flex gap-2">
                      {post.categories.map((cat) => (
                        <span
                          key={cat.slug.current}
                          className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          {cat.title}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="font-heading text-lg font-bold text-foreground group-hover:text-orange">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    {post.author && <span>{post.author.name}</span>}
                    <span>&middot;</span>
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.readTime && (
                      <>
                        <span>&middot;</span>
                        <span>{post.readTime} min read</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </ViewportFade>
          ),
        )}
      </div>

      {(!posts || posts.length === 0) && (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">No blog posts yet.</p>
          <p className="mt-2 text-sm">Check back soon for new content!</p>
        </div>
      )}
    </div>
  );
}

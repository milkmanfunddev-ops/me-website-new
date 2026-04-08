import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient, urlFor } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import { ViewportFade } from "@/components/viewport-fade";

const getCategoryWithPosts = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const category = await sanityClient.fetch(
      `*[_type == "blogCategory" && slug.current == $slug][0] {
        _id, title, slug, description, color
      }`,
      { slug },
    );

    const posts = await sanityClient.fetch(
      `*[_type == "blogPost" && $slug in categories[]->slug.current && status == "published"] | order(publishedAt desc) {
        _id, title, slug, excerpt, readTime, publishedAt, featuredImage,
        "author": author->{name, slug, avatar}
      }`,
      { slug },
    );

    const allCategories = await sanityClient.fetch(`
      *[_type == "blogCategory"] | order(title asc) {
        _id, title, slug
      }
    `);

    return { category, posts, allCategories };
  });

export const Route = createFileRoute("/blog/category/$slug")({
  head: ({ loaderData }) => {
    const data = loaderData as { category?: { title?: string } };
    return {
      meta: [
        {
          title: `${data?.category?.title || "Category"} | Mealvana Endurance Blog`,
        },
      ],
    };
  },
  loader: async ({ params }) => getCategoryWithPosts({ data: params.slug }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, posts, allCategories } = Route.useLoaderData() as {
    category: {
      _id: string;
      title: string;
      slug: { current: string };
      description?: string;
      color?: { hex: string };
    };
    posts: Array<{
      _id: string;
      title: string;
      slug: { current: string };
      excerpt: string;
      readTime: number;
      publishedAt: string;
      featuredImage?: { asset: unknown };
      author?: { name: string };
    }>;
    allCategories: Array<{
      _id: string;
      title: string;
      slug: { current: string };
    }>;
  };

  if (!category) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Category not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-orange hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ViewportFade>
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-3 text-lg text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>
      </ViewportFade>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          to="/blog"
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-cream-dark"
        >
          All
        </Link>
        {allCategories?.map(
          (cat: { _id: string; title: string; slug: { current: string } }) => (
            <Link
              key={cat._id}
              to={`/blog/category/${cat.slug.current}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                cat.slug.current === category.slug.current
                  ? "bg-blackberry text-cream"
                  : "border border-border text-muted-foreground hover:bg-cream-dark"
              }`}
            >
              {cat.title}
            </Link>
          ),
        )}
      </div>

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
          <p className="text-lg">No posts in this category yet.</p>
          <Link to="/blog" className="mt-4 inline-block text-orange hover:underline">
            Back to all posts
          </Link>
        </div>
      )}
    </div>
  );
}

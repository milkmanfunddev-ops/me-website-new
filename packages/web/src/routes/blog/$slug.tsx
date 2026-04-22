import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient, urlFor } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import { PortableText } from "@/components/portable-text";
import { ViewportFade } from "@/components/viewport-fade";
import { ArrowLeft } from "lucide-react";
import { articleJsonLd } from "@/lib/structured-data";

const getPost = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return sanityClient.fetch(
      `
      *[_type == "blogPost" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        readTime,
        publishedAt,
        featuredImage,
        heroImage,
        tags,
        body,
        seoTitle,
        seoDescription,
        ogImage,
        "author": author->{name, slug, avatar, bio, role},
        "categories": categories[]->{title, slug}
      }
    `,
      { slug },
    );
  });

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData }) => {
    const post = loaderData as {
      title?: string;
      seoTitle?: string;
      seoDescription?: string;
      excerpt?: string;
      slug?: { current: string };
      publishedAt?: string;
      author?: { name: string };
    } | null;
    return {
      meta: [
        {
          title: `${post?.seoTitle || post?.title || "Blog Post"} | Mealvana Endurance`,
        },
        {
          name: "description",
          content: post?.seoDescription || post?.excerpt || "",
        },
        { property: "og:type", content: "article" },
        { property: "og:title", content: post?.seoTitle || post?.title || "" },
        {
          property: "og:description",
          content: post?.seoDescription || post?.excerpt || "",
        },
      ],
      scripts: post
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(
                articleJsonLd({
                  title: post.title || "",
                  excerpt: post.excerpt,
                  publishedAt: post.publishedAt || "",
                  author: post.author,
                  slug: post.slug?.current || "",
                }),
              ),
            },
          ]
        : [],
    };
  },
  loader: async ({ params }) => {
    return getPost({ data: params.slug });
  },
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData() as {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt: string;
    readTime: number;
    publishedAt: string;
    featuredImage?: { asset: unknown; alt?: string };
    heroImage?: { asset: unknown; alt?: string; caption?: string };
    tags?: string[];
    body: unknown[];
    author?: {
      name: string;
      slug: { current: string };
      avatar?: { asset: unknown };
      bio?: unknown[];
      role?: string;
    };
    categories?: Array<{ title: string; slug: { current: string } }>;
  };

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-orange hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ViewportFade>
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {post.categories && post.categories.length > 0 && (
          <div className="mb-4 flex gap-2">
            {post.categories.map((cat) => (
              <Link
                key={cat.slug.current}
                to={`/blog/category/${cat.slug.current}`}
                className="rounded-full bg-cream-dark px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-orange/10 hover:text-orange"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        )}

        <h1 className="font-heading text-4xl font-bold leading-tight text-foreground">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          {post.author && (
            <Link
              to={`/blog/author/${post.author.slug.current}`}
              className="flex items-center gap-2 hover:text-foreground"
            >
              {post.author.avatar?.asset && (
                <img
                  src={urlFor(post.author.avatar).width(32).height(32).url()}
                  alt={post.author.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              <span className="font-medium">{post.author.name}</span>
            </Link>
          )}
          <span>{formatDate(post.publishedAt)}</span>
          {post.readTime && <span>{post.readTime} min read</span>}
        </div>
      </ViewportFade>

      {(() => {
        const hero = post.featuredImage?.asset
          ? post.featuredImage
          : post.heroImage?.asset
            ? post.heroImage
            : null;
        if (!hero) return null;
        return (
          <ViewportFade>
            <img
              src={urlFor(hero).width(1200).url()}
              alt={hero.alt || post.title}
              className="mt-8 w-full rounded-xl"
            />
          </ViewportFade>
        );
      })()}

      <ViewportFade>
        <div className="prose-mealvana mt-10">
          <PortableText value={post.body} />
        </div>
      </ViewportFade>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cream-dark px-3 py-1 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {post.author && (
        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            {post.author.avatar?.asset && (
              <img
                src={urlFor(post.author.avatar).width(64).height(64).url()}
                alt={post.author.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <div>
              <Link
                to={`/blog/author/${post.author.slug.current}`}
                className="font-heading text-lg font-bold text-foreground hover:text-orange"
              >
                {post.author.name}
              </Link>
              {post.author.role && (
                <p className="text-sm text-muted-foreground">
                  {post.author.role}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

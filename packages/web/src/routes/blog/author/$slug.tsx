import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient, urlFor } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import { PortableText } from "@/components/portable-text";
import { ViewportFade } from "@/components/viewport-fade";

const getAuthor = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const author = await sanityClient.fetch(
      `*[_type == "author" && slug.current == $slug][0] {
        _id, name, slug, avatar, bio, role, email, socialLinks
      }`,
      { slug },
    );

    const posts = await sanityClient.fetch(
      `*[_type == "blogPost" && author->slug.current == $slug && status == "published"] | order(publishedAt desc) {
        _id, title, slug, excerpt, readTime, publishedAt, featuredImage
      }`,
      { slug },
    );

    return { author, posts };
  });

export const Route = createFileRoute("/blog/author/$slug")({
  head: ({ loaderData }) => {
    const data = loaderData as { author?: { name?: string } };
    return {
      meta: [
        { title: `${data?.author?.name || "Author"} | Mealvana Endurance Blog` },
      ],
    };
  },
  loader: async ({ params }) => getAuthor({ data: params.slug }),
  component: AuthorPage,
});

function AuthorPage() {
  const { author, posts } = Route.useLoaderData() as {
    author: {
      name: string;
      avatar?: { asset: unknown };
      bio?: unknown[];
      role?: string;
    };
    posts: Array<{
      _id: string;
      title: string;
      slug: { current: string };
      excerpt: string;
      readTime: number;
      publishedAt: string;
    }>;
  };

  if (!author) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Author not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ViewportFade>
        <div className="flex items-start gap-6">
          {author.avatar?.asset && (
            <img
              src={urlFor(author.avatar).width(128).height(128).url()}
              alt={author.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="font-heading text-3xl font-bold">{author.name}</h1>
            {author.role && (
              <p className="mt-1 text-muted-foreground">{author.role}</p>
            )}
          </div>
        </div>
        {author.bio && (
          <div className="mt-6">
            <PortableText value={author.bio} />
          </div>
        )}
      </ViewportFade>

      <ViewportFade>
        <h2 className="mb-6 mt-12 font-heading text-2xl font-bold">
          Posts by {author.name}
        </h2>
        <div className="space-y-6">
          {posts?.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug.current}`}
              className="block rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <h3 className="font-heading text-lg font-bold text-foreground hover:text-orange">
                {post.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                <span>{formatDate(post.publishedAt)}</span>
                {post.readTime && <span>{post.readTime} min read</span>}
              </div>
            </Link>
          ))}
        </div>
      </ViewportFade>
    </div>
  );
}

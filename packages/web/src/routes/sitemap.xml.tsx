import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "@/lib/sanity";
import { APP_URL } from "@mealvana/shared";

const generateSitemap = createServerFn({ method: "GET" }).handler(async () => {
  const [posts, categories, authors, legalDocs] = await Promise.all([
    sanityClient.fetch<Array<{ slug: { current: string }; _updatedAt: string }>>(
      `*[_type == "blogPost" && status == "published"] | order(publishedAt desc) { slug, _updatedAt }`,
    ),
    sanityClient.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "blogCategory"] { slug }`,
    ),
    sanityClient.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "author"] { slug }`,
    ),
    sanityClient.fetch<Array<{ slug: { current: string }; _updatedAt: string }>>(
      `*[_type == "legalDoc"] { slug, _updatedAt }`,
    ),
  ]);

  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "/blog", priority: "0.9", changefreq: "daily" },
    { url: "/faq", priority: "0.7", changefreq: "weekly" },
    { url: "/changelog", priority: "0.6", changefreq: "monthly" },
    { url: "/about", priority: "0.6", changefreq: "monthly" },
    { url: "/support", priority: "0.5", changefreq: "monthly" },
    { url: "/demo", priority: "0.7", changefreq: "monthly" },
    { url: "/community", priority: "0.8", changefreq: "daily" },
  ];

  const urls = [
    ...staticPages.map(
      (p) =>
        `<url><loc>${APP_URL}${p.url}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
    ),
    ...posts.map(
      (p) =>
        `<url><loc>${APP_URL}/blog/${p.slug.current}</loc><lastmod>${p._updatedAt?.split("T")[0]}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    ),
    ...categories.map(
      (c) =>
        `<url><loc>${APP_URL}/blog/category/${c.slug.current}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`,
    ),
    ...authors.map(
      (a) =>
        `<url><loc>${APP_URL}/blog/author/${a.slug.current}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    ),
    ...legalDocs.map((d) => {
      const path = d.slug.current === "privacy-policy" ? "/privacy" : "/terms";
      return `<url><loc>${APP_URL}${path}</loc><lastmod>${d._updatedAt?.split("T")[0]}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>`;
    }),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
});

export const Route = createFileRoute("/sitemap/xml")({
  loader: async () => {
    return generateSitemap();
  },
  component: () => null,
});

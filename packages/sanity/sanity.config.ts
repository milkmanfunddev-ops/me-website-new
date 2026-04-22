import { defineConfig } from "sanity";
import { type StructureBuilder, structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { colorInput } from "@sanity/color-input";
import { table } from "@sanity/table";
import { assist } from "@sanity/assist";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { presentationTool } from "sanity/presentation";
import { media } from "sanity-plugin-media";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { vercelDeployTool } from "sanity-plugin-vercel-deploy";
import { taxonomyManager } from "sanity-plugin-taxonomy-manager";
import { markdownSchema } from "sanity-plugin-markdown";
import { Iframe } from "sanity-plugin-iframe-pane";
import type { SanityDocument } from "sanity";

import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "sigrvh1t";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const siteUrl =
  process.env.SANITY_STUDIO_PREVIEW_URL || "https://endurance.mealvana.io";

/* ------------------------------------------------------------------ */
/*  Preview URL resolver                                               */
/* ------------------------------------------------------------------ */

function resolvePreviewUrl(doc: SanityDocument) {
  const slug =
    (doc?.slug as { current?: string })?.current ?? (doc?.slug as string);
  switch (doc?._type) {
    case "blogPost":
      return slug ? `${siteUrl}/blog/${slug}` : siteUrl;
    case "changelog":
      return `${siteUrl}/changelog`;
    case "legalDoc":
      return slug ? `${siteUrl}/${slug}` : siteUrl;
    default:
      return siteUrl;
  }
}

/* ------------------------------------------------------------------ */
/*  Blog post views — editor + live preview + SEO pane                 */
/* ------------------------------------------------------------------ */

function blogPostViews(S: StructureBuilder) {
  return S.document()
    .schemaType("blogPost")
    .views([
      S.view.form(),
      S.view
        .component(Iframe)
        .options({
          url: (doc: SanityDocument) => resolvePreviewUrl(doc),
          reload: { button: true },
        })
        .title("Live Preview"),
    ]);
}

/* ------------------------------------------------------------------ */
/*  Desk structure                                                     */
/* ------------------------------------------------------------------ */

function structure(S: StructureBuilder, context: { documentStore: unknown; schema: unknown }) {
  return S.list()
    .title("Content")
    .items([
      /* ---- Editorial ---- */
      S.listItem()
        .title("Blog")
        .icon(() => "📝")
        .child(
          S.list()
            .title("Blog")
            .items([
              S.listItem()
                .title("All Posts")
                .icon(() => "📄")
                .schemaType("blogPost")
                .child(
                  S.documentTypeList("blogPost")
                    .title("All Posts")
                    .child((id) => blogPostViews(S).id(id)),
                ),
              S.listItem()
                .title("Published")
                .icon(() => "✅")
                .schemaType("blogPost")
                .child(
                  S.documentList()
                    .title("Published Posts")
                    .filter('_type == "blogPost" && status == "published"')
                    .child((id) => blogPostViews(S).id(id)),
                ),
              S.listItem()
                .title("In Review")
                .icon(() => "👀")
                .schemaType("blogPost")
                .child(
                  S.documentList()
                    .title("In Review")
                    .filter('_type == "blogPost" && status == "review"')
                    .child((id) => blogPostViews(S).id(id)),
                ),
              S.listItem()
                .title("Drafts")
                .icon(() => "📝")
                .schemaType("blogPost")
                .child(
                  S.documentList()
                    .title("Drafts")
                    .filter(
                      '_type == "blogPost" && (status == "draft" || !defined(status))',
                    )
                    .child((id) => blogPostViews(S).id(id)),
                ),
              S.divider(),
              S.listItem()
                .title("Authors")
                .icon(() => "👤")
                .schemaType("author")
                .child(S.documentTypeList("author").title("Authors")),
              S.listItem()
                .title("Categories")
                .icon(() => "🏷️")
                .schemaType("blogCategory")
                .child(
                  S.documentTypeList("blogCategory").title("Categories"),
                ),
            ]),
        ),

      S.divider(),

      /* ---- Product ---- */
      S.listItem()
        .title("Product")
        .icon(() => "📦")
        .child(
          S.list()
            .title("Product")
            .items([
              S.listItem()
                .title("Changelog")
                .icon(() => "🚀")
                .schemaType("changelog")
                .child(
                  S.documentTypeList("changelog")
                    .title("Changelog")
                    .defaultOrdering([
                      { field: "version", direction: "desc" },
                    ]),
                ),
              orderableDocumentListDeskItem({
                type: "faq",
                title: "FAQs",
                icon: () => "❓",
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "integrationPartner",
                title: "Integration Partners",
                icon: () => "🔗",
                S,
                context,
              }),
            ]),
        ),

      S.divider(),

      /* ---- Team & Company ---- */
      S.listItem()
        .title("Company")
        .icon(() => "🏢")
        .child(
          S.list()
            .title("Company")
            .items([
              orderableDocumentListDeskItem({
                type: "teamMember",
                title: "Team Members",
                icon: () => "👥",
                S,
                context,
              }),
              S.listItem()
                .title("Legal Documents")
                .icon(() => "⚖️")
                .schemaType("legalDoc")
                .child(
                  S.documentTypeList("legalDoc").title("Legal Documents"),
                ),
            ]),
        ),
    ]);
}

/* ------------------------------------------------------------------ */
/*  Studio config                                                      */
/* ------------------------------------------------------------------ */

export default defineConfig({
  name: "mealvana-endurance",
  title: "Mealvana Endurance",
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: `${siteUrl}/api/draft`,
        },
      },
    }),
    visionTool({ defaultApiVersion: "2026-04-07" }),
    codeInput(),
    colorInput(),
    table(),
    media(),
    assist(),
    unsplashImageAsset(),
    iconPicker(),
    markdownSchema(),
    vercelDeployTool(),
    taxonomyManager(),
  ],

  document: {
    // Open blog posts with live preview by default
    newDocumentOptions: (prev, { creationContext }) => {
      // Only show relevant types when creating from a specific context
      if (creationContext.type === "global") {
        return prev.filter(
          (item) =>
            !["teamMember", "integrationPartner", "faq"].includes(
              item.templateId,
            ),
        );
      }
      return prev;
    },
  },
});

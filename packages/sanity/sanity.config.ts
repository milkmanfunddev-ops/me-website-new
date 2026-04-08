import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { colorInput } from "@sanity/color-input";
import { table } from "@sanity/table";
import { assist } from "@sanity/assist";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { presentationTool } from "@sanity/presentation";
import { media } from "sanity-plugin-media";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { tags } from "sanity-plugin-tags";
import { iframePane } from "sanity-plugin-iframe-pane";
import { vercelDeployTool } from "sanity-plugin-vercel-deploy";
import { taxonomyManager } from "sanity-plugin-taxonomy-manager";
import { markdownSchema } from "sanity-plugin-markdown";

import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "sigrvh1t";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "mealvana-endurance",
  title: "Mealvana Endurance",
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Blog Posts")
              .schemaType("blogPost")
              .child(S.documentTypeList("blogPost").title("Blog Posts")),
            S.listItem()
              .title("Authors")
              .schemaType("author")
              .child(S.documentTypeList("author").title("Authors")),
            S.listItem()
              .title("Categories")
              .schemaType("blogCategory")
              .child(S.documentTypeList("blogCategory").title("Categories")),
            S.divider(),
            orderableDocumentListDeskItem({
              type: "faq",
              title: "FAQs",
              S,
            }),
            S.listItem()
              .title("Changelog")
              .schemaType("changelog")
              .child(S.documentTypeList("changelog").title("Changelog")),
            S.divider(),
            S.listItem()
              .title("Legal Documents")
              .schemaType("legalDoc")
              .child(S.documentTypeList("legalDoc").title("Legal Documents")),
            orderableDocumentListDeskItem({
              type: "teamMember",
              title: "Team Members",
              S,
            }),
            orderableDocumentListDeskItem({
              type: "integrationPartner",
              title: "Integration Partners",
              S,
            }),
          ]),
    }),
    presentationTool({
      previewUrl: "https://endurance.mealvana.io",
    }),
    visionTool({ defaultApiVersion: "2026-04-07" }),
    codeInput(),
    colorInput(),
    table(),
    media(),
    assist(),
    unsplashImageAsset(),
    iconPicker(),
    tags(),
    markdownSchema(),
    vercelDeployTool(),
    taxonomyManager(),
  ],
});

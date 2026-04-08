import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const rawClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2026-04-07",
  useCdn: true,
});

/** Sanity client with a safe fetch that returns fallback on error */
export const sanityClient = {
  ...rawClient,
  async fetch<T = unknown>(
    query: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    try {
      return await rawClient.fetch<T>(query, params);
    } catch (err) {
      console.warn("[sanity] fetch failed:", (err as Error).message);
      // Return null for single-doc queries, empty array for list queries
      return (query.includes("[0]") ? null : []) as T;
    }
  },
};

const builder = imageUrlBuilder(rawClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

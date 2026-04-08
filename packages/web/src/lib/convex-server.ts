import { ConvexHttpClient } from "convex/browser";

export const httpClient = new ConvexHttpClient(
  import.meta.env.VITE_CONVEX_URL,
);

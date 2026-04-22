/**
 * Shared Sanity frontend types.
 *
 * Kept permissive-but-structured so loader returns satisfy TanStack Start's
 * ServerFn<... Promise<T extends {}>> constraint without resorting to `any`.
 */

export type SanityImageAsset = {
  _ref?: string;
  _type?: string;
};

export type SanityImage = {
  asset?: SanityImageAsset;
  alt?: string;
  caption?: string;
  _type?: string;
};

// Intentionally uses `{}` (non-null/non-undefined) for the index signature
// so that loader return types satisfy TanStack Start's ServerFn<... Promise<T extends {}>> constraint.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/ban-types
type NonNull = {};

export type PortableTextBlock = {
  _type: string;
  [key: string]: NonNull;
};

export type PortableTextValue = PortableTextBlock[];

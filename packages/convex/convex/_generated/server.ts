/* eslint-disable */
// Stub file for development / testing.
// Convex CLI generates the real version via `npx convex dev`.
// These stubs provide the function constructors needed for module loading.

import {
  makeFunctionReference,
  type FunctionReference,
} from "convex/server";

// Re-export the actual function constructors from convex/server
// The real _generated/server.ts is created by the Convex CLI and wraps these
// with the correct API type. These stubs are sufficient for tests using convex-test.
export {
  queryGeneric as query,
  mutationGeneric as mutation,
  internalMutationGeneric as internalMutation,
  internalQueryGeneric as internalQuery,
  actionGeneric as action,
  internalActionGeneric as internalAction,
  httpActionGeneric as httpAction,
} from "convex/server";

import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { auth } from "@clerk/tanstack-react-start/server";

export const requireAuth = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ userId: string }> => {
    const state = await auth();
    if (!state.userId) {
      throw redirect({ to: "/sign-in" });
    }
    return { userId: state.userId };
  },
);

export const getAuthState = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ isAuthenticated: boolean; userId: string | null }> => {
    const state = await auth();
    return {
      isAuthenticated: !!state.userId,
      userId: state.userId ?? null,
    };
  },
);

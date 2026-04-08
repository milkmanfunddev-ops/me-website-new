import { getAuth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";

export const requireAuth = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();
    const auth = await getAuth(request);

    if (!auth.userId) {
      throw redirect({ to: "/sign-in" });
    }

    return { userId: auth.userId };
  },
);

export const getAuthState = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();
    const auth = await getAuth(request);

    return {
      isAuthenticated: !!auth.userId,
      userId: auth.userId,
    };
  },
);

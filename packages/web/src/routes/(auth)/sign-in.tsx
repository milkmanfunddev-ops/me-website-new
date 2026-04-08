import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/(auth)/sign-in")({
  head: () => ({
    meta: [{ title: "Sign In | Mealvana Endurance" }],
  }),
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <SignIn
        routing="hash"
        afterSignInUrl="/community"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "rounded-xl border border-border shadow-none",
          },
        }}
      />
    </div>
  );
}

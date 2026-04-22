import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/(auth)/sign-up")({
  head: () => ({
    meta: [{ title: "Sign Up | Mealvana Endurance" }],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <SignUp
        routing="hash"
        forceRedirectUrl="/community"
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

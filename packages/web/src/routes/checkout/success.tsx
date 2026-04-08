import { createFileRoute, Link } from "@tanstack/react-router";
import { ViewportFade } from "@/components/viewport-fade";
import { CheckCircle } from "lucide-react";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [{ title: "Order Confirmed | Mealvana Endurance" }],
  }),
  component: CheckoutSuccess,
});

function CheckoutSuccess() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <ViewportFade>
        <CheckCircle className="mx-auto h-16 w-16 text-electrolyte" />
        <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">
          Order Confirmed!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your purchase. You'll receive a confirmation email
          shortly.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-orange px-8 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-orange-dark"
        >
          Back to Home
        </Link>
      </ViewportFade>
    </div>
  );
}

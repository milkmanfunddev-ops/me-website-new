import { createFileRoute, Link } from "@tanstack/react-router";
import { ViewportFade } from "@/components/viewport-fade";
import { XCircle } from "lucide-react";

export const Route = createFileRoute("/checkout/cancel")({
  head: () => ({
    meta: [{ title: "Checkout Cancelled | Mealvana Endurance" }],
  }),
  component: CheckoutCancel,
});

function CheckoutCancel() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <ViewportFade>
        <XCircle className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">
          Checkout Cancelled
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your order was not completed. No charges were made.
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

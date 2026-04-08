import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const SanityStudio = lazy(() =>
  import("sanity").then((mod) => ({
    default: () => {
      const { Studio } = mod;
      return (
        <Studio
          config={{
            projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
            dataset: import.meta.env.VITE_SANITY_DATASET || "production",
            title: "Mealvana Endurance Studio",
            basePath: "/studio",
          }}
        />
      );
    },
  })),
);

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [{ title: "Studio | Mealvana Endurance" }],
  }),
  component: StudioPage,
});

function StudioPage() {
  return (
    <div className="fixed inset-0 z-50">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center bg-background">
            <p className="text-muted-foreground">Loading Studio...</p>
          </div>
        }
      >
        <SanityStudio />
      </Suspense>
    </div>
  );
}

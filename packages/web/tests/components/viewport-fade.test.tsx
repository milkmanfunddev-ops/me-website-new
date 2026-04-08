import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { ViewportFade } from "@/components/viewport-fade";

// Mock IntersectionObserver for jsdom
beforeAll(() => {
  class MockIntersectionObserver {
    callback: (entries: Array<{ isIntersecting: boolean }>) => void;
    constructor(callback: (entries: Array<{ isIntersecting: boolean }>) => void) {
      this.callback = callback;
    }
    observe() {
      this.callback([{ isIntersecting: true }]);
    }
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

describe("ViewportFade", () => {
  it("renders children", () => {
    render(
      <ViewportFade>
        <p>Content here</p>
      </ViewportFade>,
    );
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ViewportFade className="custom-class">
        <p>Content</p>
      </ViewportFade>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("accepts delay prop", () => {
    render(
      <ViewportFade delay={0.2}>
        <p>Delayed</p>
      </ViewportFade>,
    );
    expect(screen.getByText("Delayed")).toBeInTheDocument();
  });
});

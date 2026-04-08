import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ViewportFade } from "@/components/viewport-fade";

// Mock motion/react to avoid animation complexities in tests
vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  useInView: vi.fn().mockReturnValue(true),
}));

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
    // ViewportFade should accept delay without error
    render(
      <ViewportFade delay={0.2}>
        <p>Delayed</p>
      </ViewportFade>,
    );
    expect(screen.getByText("Delayed")).toBeInTheDocument();
  });
});

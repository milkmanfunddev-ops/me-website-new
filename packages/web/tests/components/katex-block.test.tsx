import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KaTeXBlock } from "@/components/katex-block";

describe("KaTeXBlock", () => {
  it("renders a valid math expression", () => {
    const { container } = render(
      <KaTeXBlock expression="E = mc^2" displayMode={false} />,
    );
    // KaTeX renders to HTML with class "katex"
    const katexEl = container.querySelector(".katex");
    expect(katexEl).toBeTruthy();
  });

  it("renders in display mode", () => {
    const { container } = render(
      <KaTeXBlock expression="\\int_0^1 x^2 dx" displayMode={true} />,
    );
    // Display mode adds katex-display class
    const displayEl = container.querySelector(".katex-display");
    expect(displayEl).toBeTruthy();
  });

  it("handles invalid LaTeX gracefully", () => {
    // KaTeX throws on invalid expressions; our component should still render
    const { container } = render(
      <KaTeXBlock expression="\\invalid{" displayMode={false} />,
    );
    // Should render something (error message or the expression text)
    expect(container.textContent).toBeTruthy();
  });

  it("renders simple fraction", () => {
    const { container } = render(
      <KaTeXBlock expression="\\frac{1}{2}" displayMode={true} />,
    );
    expect(container.querySelector(".katex")).toBeTruthy();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PortableText } from "@/components/portable-text";

// Minimal mock for TanStack Router Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("PortableText", () => {
  it("renders normal paragraph text", () => {
    const blocks = [
      {
        _type: "block",
        _key: "1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Hello World" }],
        markDefs: [],
      },
    ];

    render(<PortableText value={blocks} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders h1 heading", () => {
    const blocks = [
      {
        _type: "block",
        _key: "1",
        style: "h1",
        children: [{ _type: "span", _key: "s1", text: "Big Heading" }],
        markDefs: [],
      },
    ];

    render(<PortableText value={blocks} />);
    const heading = screen.getByText("Big Heading");
    expect(heading.tagName).toBe("H1");
  });

  it("renders h2 heading", () => {
    const blocks = [
      {
        _type: "block",
        _key: "1",
        style: "h2",
        children: [{ _type: "span", _key: "s1", text: "Section Title" }],
        markDefs: [],
      },
    ];

    render(<PortableText value={blocks} />);
    const heading = screen.getByText("Section Title");
    expect(heading.tagName).toBe("H2");
  });

  it("renders blockquote", () => {
    const blocks = [
      {
        _type: "block",
        _key: "1",
        style: "blockquote",
        children: [
          { _type: "span", _key: "s1", text: "A profound quote" },
        ],
        markDefs: [],
      },
    ];

    render(<PortableText value={blocks} />);
    expect(screen.getByText("A profound quote")).toBeInTheDocument();
  });

  it("renders strong text", () => {
    const blocks = [
      {
        _type: "block",
        _key: "1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Bold text",
            marks: ["strong"],
          },
        ],
        markDefs: [],
      },
    ];

    render(<PortableText value={blocks} />);
    const bold = screen.getByText("Bold text");
    expect(bold.tagName).toBe("STRONG");
  });

  it("renders code inline", () => {
    const blocks = [
      {
        _type: "block",
        _key: "1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "const x = 1",
            marks: ["code"],
          },
        ],
        markDefs: [],
      },
    ];

    render(<PortableText value={blocks} />);
    const code = screen.getByText("const x = 1");
    expect(code.tagName).toBe("CODE");
  });

  it("renders code block with filename", () => {
    const blocks = [
      {
        _type: "code",
        _key: "1",
        code: 'console.log("hello")',
        filename: "app.ts",
        language: "typescript",
      },
    ];

    render(<PortableText value={blocks} />);
    expect(screen.getByText("app.ts")).toBeInTheDocument();
    expect(screen.getByText('console.log("hello")')).toBeInTheDocument();
  });

  it("renders callout block with title", () => {
    const blocks = [
      {
        _type: "calloutBlock",
        _key: "1",
        type: "info",
        title: "Important Note",
        body: [
          {
            _type: "block",
            _key: "b1",
            style: "normal",
            children: [
              { _type: "span", _key: "s1", text: "Callout content" },
            ],
            markDefs: [],
          },
        ],
      },
    ];

    render(<PortableText value={blocks} />);
    expect(screen.getByText("Important Note")).toBeInTheDocument();
    expect(screen.getByText("Callout content")).toBeInTheDocument();
  });

  it("renders divider block as dots", () => {
    const blocks = [
      {
        _type: "dividerBlock",
        _key: "1",
        style: "dots",
      },
    ];

    const { container } = render(<PortableText value={blocks} />);
    expect(container.textContent).toContain("•");
  });

  it("renders nutrition fact block", () => {
    const blocks = [
      {
        _type: "nutritionFactBlock",
        _key: "1",
        nutrient: "Carbohydrates",
        amount: "60",
        unit: "g",
        dailyValue: "20",
      },
    ];

    render(<PortableText value={blocks} />);
    expect(screen.getByText("Carbohydrates")).toBeInTheDocument();
    expect(screen.getByText(/60/)).toBeInTheDocument();
  });

  it("renders button block", () => {
    const blocks = [
      {
        _type: "buttonBlock",
        _key: "1",
        label: "Click Me",
        href: "https://example.com",
        variant: "primary",
      },
    ];

    render(<PortableText value={blocks} />);
    const link = screen.getByText("Click Me");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("renders citation block", () => {
    const blocks = [
      {
        _type: "citationBlock",
        _key: "1",
        text: "Carbohydrate is essential for endurance performance",
        authors: "Smith et al.",
        journal: "J Sports Sci",
        year: "2023",
      },
    ];

    render(<PortableText value={blocks} />);
    expect(
      screen.getByText("Carbohydrate is essential for endurance performance"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Smith et al/)).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const blocks = [
      {
        _type: "block",
        _key: "1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Styled" }],
        markDefs: [],
      },
    ];

    const { container } = render(
      <PortableText value={blocks} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

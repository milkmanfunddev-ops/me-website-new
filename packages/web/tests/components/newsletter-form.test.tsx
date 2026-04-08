import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { NewsletterForm } from "@/components/newsletter-form";

const mockSubscribe = vi.fn();

vi.mock("convex/react", () => ({
  useMutation: () => mockSubscribe,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("NewsletterForm", () => {
  beforeEach(() => {
    mockSubscribe.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders email input and submit button", () => {
    render(<NewsletterForm source="homepage" />);
    expect(
      screen.getByPlaceholderText("Enter your email"),
    ).toBeInTheDocument();
    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });

  it("has required email validation", () => {
    render(<NewsletterForm source="homepage" />);
    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("type", "email");
  });

  it("calls subscribe mutation on submit", async () => {
    mockSubscribe.mockResolvedValue("id_123");
    render(<NewsletterForm source="footer" />);

    const input = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(mockSubscribe).toHaveBeenCalledWith({
        email: "test@example.com",
        source: "footer",
      });
    });
  });

  it("clears input after successful submission", async () => {
    mockSubscribe.mockResolvedValue("id_123");
    render(<NewsletterForm source="homepage" />);

    const input = screen.getByPlaceholderText(
      "Enter your email",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("shows loading state during submission", async () => {
    let resolveSubmit: (value: string) => void;
    mockSubscribe.mockReturnValue(
      new Promise<string>((resolve) => {
        resolveSubmit = resolve;
      }),
    );

    render(<NewsletterForm source="homepage" />);

    const input = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Subscribing...")).toBeInTheDocument();
    });

    resolveSubmit!("id_123");

    await waitFor(() => {
      expect(screen.getByText("Subscribe")).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <NewsletterForm source="homepage" className="custom-class" />,
    );
    expect(container.querySelector("form")).toHaveClass("custom-class");
  });
});

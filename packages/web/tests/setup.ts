import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock sanity client
vi.mock("@/lib/sanity", () => ({
  sanityClient: {
    fetch: vi.fn().mockResolvedValue(null),
  },
  urlFor: vi.fn().mockReturnValue({
    width: vi.fn().mockReturnThis(),
    height: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue("https://cdn.sanity.io/test.jpg"),
  }),
}));

// Mock convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn().mockReturnValue(undefined),
  useMutation: vi.fn().mockReturnValue(vi.fn()),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock clerk
vi.mock("@clerk/tanstack-react-start", () => ({
  useAuth: vi.fn().mockReturnValue({ isSignedIn: false }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignIn: () => null,
  SignUp: () => null,
}));

// Mock motion
vi.mock("motion/react", () => ({
  motion: {
    div: "div",
    span: "span",
  },
  useInView: vi.fn().mockReturnValue(true),
}));

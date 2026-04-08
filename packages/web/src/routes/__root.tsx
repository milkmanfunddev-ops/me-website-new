/// <reference types="vite/client" />
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import {
  ClerkProvider,
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/tanstack-react-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { convexClient } from "@/lib/convex";
import { Toaster } from "sonner";
import appCss from "@/styles/globals.css?url";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  APP_NAME,
  APP_DESCRIPTION,
  COMPANY_NAME,
  APP_STORE_LINK,
  PLAY_STORE_LINK,
  CONTACT_EMAIL,
  APP_URL,
} from "@mealvana/shared";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: `${APP_NAME} | Science-Based Nutrition for Endurance Athletes`,
      },
      { name: "description", content: APP_DESCRIPTION },
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: APP_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: APP_URL },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "apple-itunes-app",
        content: "app-id=6751113738",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.45/dist/katex.min.css",
      },
    ],
  }),
  component: RootComponent,
});

function AppShell() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
}

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        >
          <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
            <AppShell />
          </ConvexProviderWithClerk>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}

function AuthButtons() {
  return (
    <>
      <ClerkLoading>
        <Link
          to="/sign-in"
          className="ml-2 rounded-full bg-blackberry px-5 py-2 font-heading text-sm font-bold text-cream transition-colors hover:bg-blackberry-light"
        >
          Sign In
        </Link>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <UserButton
            appearance={{ elements: { avatarBox: "h-8 w-8" } }}
          />
        </SignedIn>
        <SignedOut>
          <Link
            to="/sign-in"
            className="ml-2 rounded-full bg-blackberry px-5 py-2 font-heading text-sm font-bold text-cream transition-colors hover:bg-blackberry-light"
          >
            Sign In
          </Link>
        </SignedOut>
      </ClerkLoaded>
    </>
  );
}

function MobileAuthButtons({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <ClerkLoading>
        <Link
          to="/sign-in"
          className="mt-2 rounded-full bg-blackberry px-5 py-2 text-center font-heading text-sm font-bold text-cream"
          onClick={onNavigate}
        >
          Sign In
        </Link>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <Link
            to="/community"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-cream-dark"
            onClick={onNavigate}
          >
            My Account
          </Link>
        </SignedIn>
        <SignedOut>
          <Link
            to="/sign-in"
            className="mt-2 rounded-full bg-blackberry px-5 py-2 text-center font-heading text-sm font-bold text-cream"
            onClick={onNavigate}
          >
            Sign In
          </Link>
        </SignedOut>
      </ClerkLoaded>
    </>
  );
}

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-cream-dark hover:text-foreground";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/appicon.png"
            alt="Mealvana"
            className="h-8 w-8 rounded-lg"
          />
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/blog" className={navLinkClass}>
            Blog
          </Link>
          <Link to="/changelog" className={navLinkClass}>
            Changelog
          </Link>
          <Link to="/community" className={navLinkClass}>
            Community
          </Link>
          <Link to="/support" className={navLinkClass}>
            Support
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <AuthButtons />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-cream-dark md:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              to="/blog"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-cream-dark"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/changelog"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-cream-dark"
              onClick={() => setMobileOpen(false)}
            >
              Changelog
            </Link>
            <Link
              to="/community"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-cream-dark"
              onClick={() => setMobileOpen(false)}
            >
              Community
            </Link>
            <Link
              to="/support"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-cream-dark"
              onClick={() => setMobileOpen(false)}
            >
              Support
            </Link>
            <hr className="my-2 border-border" />
            <MobileAuthButtons onNavigate={() => setMobileOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-cream-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/appicon.png"
                alt="Mealvana"
                className="h-7 w-7 rounded-lg"
              />
              <span className="font-heading text-lg font-bold text-foreground">
                {APP_NAME}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {APP_DESCRIPTION}
            </p>
            <div className="mt-4 flex gap-3">
              <a href={APP_STORE_LINK} target="_blank" rel="noopener noreferrer">
                <img
                  src="/appstore.png"
                  alt="Download on the App Store"
                  className="h-10"
                />
              </a>
              <a
                href={PLAY_STORE_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/playstore.png"
                  alt="Get it on Google Play"
                  className="h-10"
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-foreground">
              Resources
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="hover:text-foreground">
                  What's New
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-foreground">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-foreground">
              Community
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/community" className="hover:text-foreground">
                  Forum
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-foreground">
                  Support
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-foreground"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}

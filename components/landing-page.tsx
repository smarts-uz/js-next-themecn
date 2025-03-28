"use client";

import { useThemeStore } from "@/lib/store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight as ArrowIcon, Github, ExternalLink } from "lucide-react";

import { CardsDemo } from "@/components/cards";
import Link from "next/link";

export default function LandingPage() {
  const { fonts } = useThemeStore();

  return (
    <div className="min-h-screen pb-32 bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-2 md:px-3 max-w-6xl">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary"></div>
              <span
                className="font-bold text-xl text-foreground"
                style={{ fontFamily: fonts.heading }}
              >
                themecn
              </span>
            </div>

            <div className="flex items-center">
              <Link
                href="https://github.com/jordanliu/themecn"
                className={buttonVariants()}
              >
                <Github /> Star
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-2 md:px-3 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left side - Description */}
            <div className="text-left">
              <h1
                className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground"
                style={{ fontFamily: fonts.heading }}
              >
                The Ultimate <span className="text-primary">Theme Builder</span>{" "}
                for shadcn/ui
              </h1>
              <p
                className="text-lg text-muted-foreground mb-8"
                style={{ fontFamily: fonts.body }}
              >
                themecn makes it easy to create, visualize, and export custom
                themes for your shadcn/ui projects. Create your perfect theme in
                real-time with our intuitive interface.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  Start Creating
                  <ArrowIcon className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Github className="mr-2 h-4 w-4" />
                  View Source
                </Button>
              </div>
            </div>

            {/* Right side - How it works */}
            <div className="bg-muted/40 border border-border rounded-lg p-6">
              <h2
                className="text-xl font-semibold mb-6 text-foreground"
                style={{ fontFamily: fonts.heading }}
              >
                How it works
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Customize</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the theme dock to adjust colors, fonts, and border
                      radius
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Preview</h3>
                    <p className="text-sm text-muted-foreground">
                      See your changes instantly applied to shadcn/ui components
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Download your theme as CSS variables or Tailwind config
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Component Showcase Grid */}
          <div className="mt-12 mb-6">
            <CardsDemo />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-2 md:px-3 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-full bg-primary"></div>
                <span
                  className="font-bold text-xl text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  themecn
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                The ultimate shadcn/ui theme builder. Create, preview, and
                export your custom themes with ease.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/jordankimvt/themecn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="https://ui.shadcn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3
                className="font-medium text-foreground mb-4"
                style={{ fontFamily: fonts.heading }}
              >
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://ui.shadcn.com/docs"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://ui.shadcn.com/docs/components"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Components
                  </a>
                </li>
                <li>
                  <a
                    href="https://ui.shadcn.com/themes"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Themes
                  </a>
                </li>
                <li>
                  <a
                    href="https://ui.shadcn.com/docs/installation"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Installation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="font-medium text-foreground mb-4"
                style={{ fontFamily: fonts.heading }}
              >
                Community
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com/shadcn/ui"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/shadcn"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="font-medium text-foreground mb-4"
                style={{ fontFamily: fonts.heading }}
              >
                Stay Updated
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest updates.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button size="sm" variant="default">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} themecn. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

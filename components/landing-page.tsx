"use client";

import { useThemeStore } from "@/lib/store";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight as ArrowIcon, CoffeeIcon, Github } from "lucide-react";

import { CardsDemo } from "@/components/cards";
import Link from "next/link";
import { Icons } from "./icons";
import { NavigationCombobox } from "./navigation-combobox";

export default function LandingPage() {
  const { fonts } = useThemeStore();

  return (
    <div className="min-h-screen pb-24 bg-background">
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

            <div className="flex items-center gap-3">
              <NavigationCombobox />
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
                <Link href="/dashboard">
                  <Button size="lg">
                    Start Creating
                    <ArrowIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href="https://github.com/jordanliu/themecn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    <Github className="mr-2 h-4 w-4" />
                    View Source
                  </Button>
                </a>
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
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              Built by @jordanxliu, inspired by @shadcn from shadcn/ui and
              @juxtopposed from realtimecolors
            </p>
            <div className="flex items-center gap-2 mt-4">
              <a
                href="https://github.com/jordankimvt/themecn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icons.gitHub className="h-5 w-5" />
              </a>

              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icons.shadcnLogo className="h-5 w-5" />
              </a>
              <a
                href="https://buymeacoffee.com/jordanliu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CoffeeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useThemeStore } from "@/lib/store";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight as ArrowIcon, CoffeeIcon } from "lucide-react";

import { CardsDemo } from "@/components/cards";
import Link from "next/link";
import { Icons } from "./icons";
import { NavigationCombobox } from "./navigation-combobox";

export default function LandingPage() {
  const { fonts } = useThemeStore();
  const { generateHarmonyColors } = useThemeStore();

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-2 md:px-3 max-w-6xl">
          <div className="py-4 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary"></div>
                <span
                  className="font-bold text-xl text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  themecn
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <NavigationCombobox />
              <div className="hidden lg:block">
                <Link
                  href="https://github.com/jordanliu/themecn"
                  className={buttonVariants()}
                >
                  <Icons.gitHub /> Star
                </Link>
              </div>
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
                <span className="text-primary">Theme Builder</span> for
                shadcn/ui
              </h1>
              <p
                className="text-lg text-muted-foreground mb-8"
                style={{ fontFamily: fonts.body }}
              >
                themecn streamlines your design workflow with powerful,
                intuitive theme creation for shadcn/ui. Experiment with colors,
                typography, and more—all with instant visual feedback. No more
                guesswork.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={generateHarmonyColors}
                  className="cursor-pointer"
                >
                  Create Your Theme
                  <ArrowIcon className="ml-2 h-4 w-4" />
                </Button>

                <Link
                  href="https://github.com/jordanliu/themecn"
                  target="_blank"
                  className="w-full sm:w-auto"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                    View Source
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - How it works */}
            <div className="bg-muted/40 border border-border rounded-lg p-6">
              <h2
                className="text-xl font-semibold mb-6 text-foreground"
                style={{ fontFamily: fonts.heading }}
              >
                Simple Three-Step Process
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Design & Customize</h3>
                    <p className="text-sm text-muted-foreground">
                      Fine-tune colors, select fonts, and adjust radius values
                      with our intuitive controls
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Live Preview</h3>
                    <p className="text-sm text-muted-foreground">
                      Watch your theme come to life in real-time across all
                      shadcn/ui components
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Import</h3>
                    <p className="text-sm text-muted-foreground">
                      Simply import into your existing shadcn/ui app
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
              themecn is an open-source project built by{" "}
              <a
                href="https://x.com/jordanxliu"
                target="_blank"
                className="underline"
                rel="noopener noreferrer"
              >
                @jordanxliu
              </a>
              . Inspired by the work of{" "}
              <a
                href="https://x.com/shadcn"
                target="_blank"
                className="underline"
                rel="noopener noreferrer"
              >
                @shadcn
              </a>{" "}
              and{" "}
              <a
                href="https://x.com/juxtopposed"
                target="_blank"
                className="underline"
                rel="noopener noreferrer"
              >
                @juxtopposed
              </a>
              .
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Link
                href="https://github.com/jordanliu/themecn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icons.gitHub className="h-5 w-5" />
              </Link>

              <Link
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icons.shadcnLogo className="h-5 w-5" />
              </Link>
              <Link
                href="https://buymeacoffee.com/jordanliu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CoffeeIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

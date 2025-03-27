"use client";

import { useThemeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Check,
  Star,
  Code,
  Palette,
  Layers,
  Sparkles,
  Users,
  BarChart,
} from "lucide-react";
import { CSSVariablesShowcase } from "@/components/css-variables-showcase";

export default function LandingPage() {
  const { fonts } = useThemeStore();

  return (
    <div className="min-h-screen pb-32 bg-background">
      {/* Header */}
      <header className="bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary"></div>
            <span
              className="font-bold text-xl text-foreground"
              style={{ fontFamily: fonts.heading }}
            >
              ThemeCN
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Templates
            </a>
            <a
              href="#pricing"
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="#docs"
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Docs
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Log in
            </Button>
            <Button size="sm">Sign up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">New Release</Badge>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-foreground"
            style={{ fontFamily: fonts.heading }}
          >
            Visualize Your <span className="text-primary">Colors</span> & Fonts
            <br />
            On a Real Site
          </h1>
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            style={{ fontFamily: fonts.body }}
          >
            Choosing colors or typography for your website? Use the toolbar
            below to realize your choices in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              How does it work?
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              style={{ fontFamily: fonts.heading }}
            >
              Why ThemeCN?
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              style={{ fontFamily: fonts.body }}
            >
              The fastest way to visualize and test your design system in a
              real-world context.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Palette className="h-6 w-6 text-primary" />,
                title: "Real-time Preview",
                description:
                  "See your color and font changes instantly applied to a real website layout.",
              },
              {
                icon: <Code className="h-6 w-6 text-primary" />,
                title: "Export Your Theme",
                description:
                  "Generate CSS variables or download a complete theme file ready to use in your projects.",
              },
              {
                icon: <Layers className="h-6 w-6 text-primary" />,
                title: "Multiple Templates",
                description:
                  "Test your theme across different website templates to ensure consistency.",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle
                    className="text-foreground"
                    style={{ fontFamily: fonts.heading }}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-muted-foreground"
                    style={{ fontFamily: fonts.body }}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CSS Variables Showcase Section */}
      <CSSVariablesShowcase />

      {/* Tabs Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              style={{ fontFamily: fonts.heading }}
            >
              Explore ThemeCN
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              style={{ fontFamily: fonts.body }}
            >
              Discover all the powerful features that make ThemeCN the perfect
              tool for your design workflow.
            </p>
          </div>

          <Tabs defaultValue="designers" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="designers">For Designers</TabsTrigger>
              <TabsTrigger value="developers">For Developers</TabsTrigger>
              <TabsTrigger value="teams">For Teams</TabsTrigger>
            </TabsList>
            <TabsContent value="designers" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-bold mb-4 text-foreground"
                    style={{ fontFamily: fonts.heading }}
                  >
                    Perfect for Design Exploration
                  </h3>
                  <p
                    className="text-muted-foreground mb-6"
                    style={{ fontFamily: fonts.body }}
                  >
                    Experiment with colors, typography, and spacing in
                    real-time. See your design choices come to life on a real
                    website layout.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Color harmony suggestions",
                      "Typography pairing recommendations",
                      "Export design tokens",
                      "Save and share design systems",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span
                          className="text-foreground"
                          style={{ fontFamily: fonts.body }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6">
                    Start Designing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted rounded-lg aspect-video"></div>
              </div>
            </TabsContent>
            <TabsContent value="developers" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-bold mb-4 text-foreground"
                    style={{ fontFamily: fonts.heading }}
                  >
                    Built for Developer Workflow
                  </h3>
                  <p
                    className="text-muted-foreground mb-6"
                    style={{ fontFamily: fonts.body }}
                  >
                    Generate CSS variables, design tokens, and theme
                    configurations that integrate seamlessly with your codebase.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "CSS variable export",
                      "Tailwind config generation",
                      "Design token JSON",
                      "Framework-agnostic themes",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span
                          className="text-foreground"
                          style={{ fontFamily: fonts.body }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6">
                    View Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted rounded-lg aspect-video"></div>
              </div>
            </TabsContent>
            <TabsContent value="teams" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-bold mb-4 text-foreground"
                    style={{ fontFamily: fonts.heading }}
                  >
                    Collaborate with Your Team
                  </h3>
                  <p
                    className="text-muted-foreground mb-6"
                    style={{ fontFamily: fonts.body }}
                  >
                    Share themes, collaborate on design systems, and maintain
                    consistency across all your projects.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Team libraries",
                      "Version history",
                      "Comments and feedback",
                      "Role-based permissions",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span
                          className="text-foreground"
                          style={{ fontFamily: fonts.body }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6">
                    Team Features
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted rounded-lg aspect-video"></div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              style={{ fontFamily: fonts.heading }}
            >
              Simple, Transparent Pricing
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              style={{ fontFamily: fonts.body }}
            >
              Choose the plan that&apos;s right for you and start creating
              beautiful, consistent designs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="relative bg-card rounded-lg border border-border overflow-hidden flex flex-col h-full">
              <div className="p-6 flex-1">
                <h3
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  Free
                </h3>
                <div className="flex items-baseline mt-4 mb-2">
                  <span
                    className="text-5xl font-bold text-foreground"
                    style={{ fontFamily: fonts.heading }}
                  >
                    $0
                  </span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Perfect for trying out ThemeCN
                </p>

                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Basic color tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Standard fonts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">1 project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      Export CSS variables
                    </span>
                  </li>
                </ul>
              </div>
              <div className="p-6 mt-auto">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-card rounded-lg border border-primary overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground py-1 px-3 rounded-bl-md">
                  Popular
                </div>
              </div>
              <div className="p-6 flex-1">
                <h3
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  Pro
                </h3>
                <div className="flex items-baseline mt-4 mb-2">
                  <span
                    className="text-5xl font-bold text-foreground"
                    style={{ fontFamily: fonts.heading }}
                  >
                    $12
                  </span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Everything you need for professional design
                </p>

                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      Advanced color tools
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Custom font uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Unlimited projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">All export formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Team sharing</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 mt-auto">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Free Trial
                </Button>
              </div>
            </div>

            {/* Team Plan */}
            <div className="relative bg-card rounded-lg border border-border overflow-hidden flex flex-col h-full">
              <div className="p-6 flex-1">
                <h3
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  Team
                </h3>
                <div className="flex items-baseline mt-4 mb-2">
                  <span
                    className="text-5xl font-bold text-foreground"
                    style={{ fontFamily: fonts.heading }}
                  >
                    $49
                  </span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  For design teams and organizations
                </p>

                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Team libraries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Role permissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Version history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">API access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Priority support</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 mt-auto">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              style={{ fontFamily: fonts.heading }}
            >
              Frequently Asked Questions
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              style={{ fontFamily: fonts.body }}
            >
              Everything you need to know about ThemeCN and how it can help your
              design workflow.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger
                  className="text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  How does ThemeCN differ from other color tools?
                </AccordionTrigger>
                <AccordionContent
                  className="text-foreground"
                  style={{ fontFamily: fonts.body }}
                >
                  Unlike traditional color pickers, ThemeCN allows you to see
                  your color choices in context on a real website layout. This
                  helps you make better design decisions by understanding how
                  colors interact with each other in a realistic environment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger
                  className="text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  Can I export my theme to use in my projects?
                </AccordionTrigger>
                <AccordionContent
                  className="text-foreground"
                  style={{ fontFamily: fonts.body }}
                >
                  Yes! ThemeCN allows you to export your theme in multiple
                  formats including CSS variables, Tailwind config, design
                  tokens JSON, and more. This makes it easy to integrate your
                  design system into any project.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger
                  className="text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  Is ThemeCN suitable for teams?
                </AccordionTrigger>
                <AccordionContent
                  className="text-foreground"
                  style={{ fontFamily: fonts.body }}
                >
                  Absolutely. Our Team plan includes features specifically
                  designed for collaboration, such as shared libraries, version
                  history, role-based permissions, and commenting. This makes it
                  easy for designers and developers to work together on
                  consistent design systems.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger
                  className="text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  Can I use custom fonts with ThemeCN?
                </AccordionTrigger>
                <AccordionContent
                  className="text-foreground"
                  style={{ fontFamily: fonts.body }}
                >
                  Yes, Pro and Team plans allow you to upload and use custom
                  fonts in your themes. The Free plan gives you access to our
                  curated collection of popular Google Fonts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger
                  className="text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  How do I get started with ThemeCN?
                </AccordionTrigger>
                <AccordionContent
                  className="text-foreground"
                  style={{ fontFamily: fonts.body }}
                >
                  Getting started is easy! Simply sign up for a free account,
                  and you&apos;ll be able to start creating and testing themes
                  immediately. Our intuitive interface makes it simple to
                  experiment with colors, fonts, and other design elements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: fonts.heading }}
            >
              Trusted by Designers Worldwide
            </h2>
            <p
              className="text-lg text-primary-foreground/90 max-w-2xl mx-auto"
              style={{ fontFamily: fonts.body }}
            >
              Join thousands of designers and teams who use ThemeCN to create
              beautiful, consistent designs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: <Users className="h-8 w-8 mx-auto mb-2" />,
                value: "10,000+",
                label: "Active Users",
              },
              {
                icon: <Palette className="h-8 w-8 mx-auto mb-2" />,
                value: "500,000+",
                label: "Themes Created",
              },
              {
                icon: <Sparkles className="h-8 w-8 mx-auto mb-2" />,
                value: "98%",
                label: "Satisfaction Rate",
              },
              {
                icon: <BarChart className="h-8 w-8 mx-auto mb-2" />,
                value: "40%",
                label: "Time Saved",
              },
            ].map((stat, index) => (
              <div key={index}>
                {stat.icon}
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ fontFamily: fonts.heading }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-primary-foreground/90"
                  style={{ fontFamily: fonts.body }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              style={{ fontFamily: fonts.heading }}
            >
              Loved by Designers
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              style={{ fontFamily: fonts.body }}
            >
              Join thousands of designers who use ThemeCN to perfect their
              design systems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Morgan",
                role: "UI Designer at Figma",
                quote:
                  "ThemeCN has completely changed how I test color schemes. It's now an essential part of my workflow.",
              },
              {
                name: "Sarah Johnson",
                role: "Frontend Developer",
                quote:
                  "Being able to export the CSS variables directly saves me so much time. Absolutely love this tool!",
              },
              {
                name: "Michael Chen",
                role: "Design System Lead",
                quote:
                  "We use ThemeCN to test our design system updates before rolling them out. It's been a game-changer.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p
                    className="mb-6 italic text-foreground flex-grow"
                    style={{ fontFamily: fonts.body }}
                  >
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-secondary/20"></div>
                    <div>
                      <p
                        className="font-medium text-foreground"
                        style={{ fontFamily: fonts.heading }}
                      >
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ fontFamily: fonts.heading }}
          >
            Ready to perfect your website&apos;s look?
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-primary-foreground/90"
            style={{ fontFamily: fonts.body }}
          >
            Start customizing your theme now and see the changes in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto font-medium"
            >
              Get Started for Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-medium"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary"></div>
                <span
                  className="font-bold text-xl text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  ThemeCN
                </span>
              </div>
              <p
                className="text-muted-foreground mb-4"
                style={{ fontFamily: fonts.body }}
              >
                The easiest way to visualize your website&apos;s colors and
                fonts in real-time.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Templates", "Pricing", "Roadmap"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Guides", "API", "Examples"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3
                  className="font-medium mb-4 text-foreground"
                  style={{ fontFamily: fonts.heading }}
                >
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        style={{ fontFamily: fonts.body }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p
              className="text-sm text-muted-foreground mb-4 md:mb-0"
              style={{ fontFamily: fonts.body }}
            >
              © 2025 ThemeCN. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Twitter</span>
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
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">GitHub</span>
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
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
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
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

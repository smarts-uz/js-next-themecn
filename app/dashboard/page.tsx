"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/store";
import ThemeDock from "@/components/theme-dock/theme-dock";
import { getThemeFromUrl } from "@/lib/theme-url";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChartIcon,
  Bell,
  CreditCard,
  Download,
  Home,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { LineChart } from "@/components/charts/line-chart";
import { AreaChart } from "@/components/charts/area-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { MultiLineChart } from "@/components/charts/multi-line-chart";
// Import the color utility
import { getCSSVariableColor } from "@/components/charts/color-utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

// Add a function to get chart colors
const getChartColors = () => {
  if (typeof window === "undefined") {
    return {
      chart1: "#e57373", // Fallback colors for SSR
      chart2: "#e773ce",
      chart3: "#73e5e5",
      chart4: "#e5e573",
      chart5: "#d373e5",
    };
  }

  return {
    chart1: getCSSVariableColor("--chart-1"),
    chart2: getCSSVariableColor("--chart-2"),
    chart3: getCSSVariableColor("--chart-3"),
    chart4: getCSSVariableColor("--chart-4"),
    chart5: getCSSVariableColor("--chart-5"),
  };
};

// Navigation menu items
const navigationItems = [
  { icon: <Home className="h-5 w-5" />, label: "Dashboard", active: true },
  { icon: <BarChartIcon className="h-5 w-5" />, label: "Analytics" },
  { icon: <Users className="h-5 w-5" />, label: "Customers" },
  { icon: <CreditCard className="h-5 w-5" />, label: "Transactions" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings" },
];

export default function Dashboard() {
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [chartColors, setChartColors] = useState({
    chart1: "hsl(1 84% 63%)",
    chart2: "hsl(321 84% 63%)",
    chart3: "hsl(181 84% 63%)",
    chart4: "hsl(61 84% 63%)",
    chart5: "hsl(301 84% 63%)",
  });

  // Apply theme from URL on client-side navigation
  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    // Apply fallback immediately to prevent flash of yellow
    document.documentElement.style.backgroundColor = "#ffffff";
    document.body.style.backgroundColor = "#ffffff";

    try {
      // Get theme from URL
      const urlTheme = getThemeFromUrl();

      if (urlTheme && isMounted) {
        console.log("Applying theme from URL");
        const store = useThemeStore.getState();

        // Apply the entire theme state at once
        store.applyThemeState(urlTheme);

        // Explicitly handle dark mode class
        if (urlTheme.isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else if (isMounted) {
        // No theme in URL, use the current theme from store
        console.log("No theme in URL, using current theme from store");
      }

      // Mark theme as loaded only if component is still mounted
      if (isMounted) {
        setIsThemeLoaded(true);
      }
    } catch (error) {
      console.error("Error applying theme from URL:", error);
      // Mark as loaded even if there's an error, but only if still mounted
      if (isMounted) {
        setIsThemeLoaded(true);
      }
    }

    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Get colors from the theme store when the component mounts
    if (isThemeLoaded) {
      setChartColors(getChartColors());
    }
  }, [isThemeLoaded]);

  // Add a useEffect that listens for theme changes
  useEffect(() => {
    let isMounted = true;

    // This will run whenever the theme changes
    if (isThemeLoaded && isMounted) {
      // Force update of chart colors when theme changes
      const colors = {
        chart1: getCSSVariableColor("--chart-1"),
        chart2: getCSSVariableColor("--chart-2"),
        chart3: getCSSVariableColor("--chart-3"),
        chart4: getCSSVariableColor("--chart-4"),
        chart5: getCSSVariableColor("--chart-5"),
      };
      setChartColors(colors);
    }

    return () => {
      isMounted = false;
    };
  }, [isThemeLoaded]);

  // Add a listener for theme changes
  useEffect(() => {
    if (!isThemeLoaded) return;

    let isMounted = true;
    const observer = new MutationObserver(() => {
      if (!isMounted) return;

      setChartColors({
        chart1: getCSSVariableColor("--chart-1"),
        chart2: getCSSVariableColor("--chart-2"),
        chart3: getCSSVariableColor("--chart-3"),
        chart4: getCSSVariableColor("--chart-4"),
        chart5: getCSSVariableColor("--chart-5"),
      });
    });

    // Observe changes to style attribute and class changes on document.documentElement
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Initial update
    observer.disconnect();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [isThemeLoaded]);

  // Show a minimal loading state until theme is loaded
  if (!isThemeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading theme...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary"></div>
            <span className="font-bold text-xl text-foreground">themecn</span>
          </div>
          <div className="flex items-center gap-4">
            <form className="hidden md:flex">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-64 pl-8 bg-background"
                />
              </div>
            </form>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
            <div className="h-full py-6 px-4">
              <div className="space-y-6">
                <div className="px-3 py-2">
                  <h2 className="mb-6 px-4 text-lg font-semibold">themecn</h2>

                  <div className="space-y-1">
                    <nav className="grid gap-2">
                      {navigationItems.map((item, index) => (
                        <Button
                          key={index}
                          variant={item.active ? "secondary" : "ghost"}
                          className="w-full justify-start h-10"
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Button>
                      ))}
                    </nav>
                  </div>

                  <div className="mt-8">
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">
                          Upgrade to Pro
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 text-xs text-muted-foreground">
                        Unlock advanced features and detailed analytics.
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button size="sm" className="w-full">
                          Upgrade
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block fixed md:sticky top-16 z-20 h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-card overflow-y-auto">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="h-4"></div>

            <nav className="grid gap-1 px-2">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "secondary" : "ghost"}
                  className="justify-start"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </nav>

            <div className="mt-auto">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Upgrade to Pro</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-xs text-muted-foreground">
                  Unlock advanced features and detailed analytics.
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here&apos;s an overview of your account.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download
                </Button>
                <Button size="sm" className="h-8">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  New Report
                </Button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Revenue",
                  value: "$45,231.89",
                  change: "+20.1%",
                },
                { label: "Subscriptions", value: "2,350", change: "+10.5%" },
                { label: "Active Users", value: "1,294", change: "+12.3%" },
                { label: "Conversion Rate", value: "3.2%", change: "-0.4%" },
              ].map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    {index === 3 ? (
                      <Badge variant="destructive" className="ml-auto">
                        {stat.change}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="ml-auto">
                        {stat.change}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts and tables */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Monthly revenue for the current year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <LineChart />
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>Latest transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "John Smith",
                        email: "john@example.com",
                        amount: "$250.00",
                      },
                      {
                        name: "Emily Johnson",
                        email: "emily@example.com",
                        amount: "$129.99",
                      },
                      {
                        name: "Michael Brown",
                        email: "michael@example.com",
                        amount: "$89.50",
                      },
                      {
                        name: "Sarah Davis",
                        email: "sarah@example.com",
                        amount: "$450.00",
                      },
                      {
                        name: "David Wilson",
                        email: "david@example.com",
                        amount: "$199.99",
                      },
                    ].map((sale, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {sale.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{sale.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {sale.email}
                          </p>
                        </div>
                        <div className="font-medium">{sale.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity and analytics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Active users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <AreaChart />
                  </div>
                </CardContent>
              </Card>
              {/* Traffic Sources section */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>
                    Where your visitors come from
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="h-[200px] w-full max-w-[300px]">
                    <DonutChart />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                    {[
                      { source: "Direct", value: "35%" },
                      { source: "Organic Search", value: "25%" },
                      { source: "Social Media", value: "20%" },
                      { source: "Referral", value: "15%" },
                      { source: "Other", value: "5%" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              index === 0
                                ? chartColors.chart1
                                : index === 1
                                ? chartColors.chart2
                                : index === 2
                                ? chartColors.chart3
                                : index === 3
                                ? chartColors.chart4
                                : chartColors.chart5,
                          }}
                        ></div>
                        <div className="text-sm">
                          <span className="font-medium">{item.source}</span>
                          <span className="ml-1 text-muted-foreground">
                            ({item.value})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rate</CardTitle>
                  <CardDescription>Weekly conversion rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <BarChart />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                  <CardDescription>Comparing key metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <MultiLineChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <ThemeDock />
    </div>
  );
}

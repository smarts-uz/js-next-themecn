import type React from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geist = Geist({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "themecn",
  description: "Interactive color theme generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.className}>
      <Head>
        <meta property="og:title" content="themecn" />
        <meta
          property="og:description"
          content="Interactive color theme generator"
        />
        <meta property="og:image" content="/og.png" />
        <meta property="og:url" content="https://themecn.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="themecn" />
      </Head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

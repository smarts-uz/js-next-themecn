"use client";

import { useState } from "react";
import { useThemeStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";
import { toast } from "sonner";

export function ExportMenu() {
  const { exportMenuOpen, setExportMenuOpen, generateCSSVariables } =
    useThemeStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCSSVariables());
    setCopied(true);
    toast("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = generateCSSVariables();
    const blob = new Blob([code], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "globals.css";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={exportMenuOpen} onOpenChange={setExportMenuOpen}>
      <DialogContent
        className="sm:max-w-[800px]"
        style={{
          backgroundColor: "white",
          color: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#1a1a1a", fontWeight: "600" }}>
            Export Theme Configuration
          </DialogTitle>
          <DialogDescription style={{ color: "#6b7280" }}>
            Choose your preferred format to export your theme configuration.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="globals" className="mt-4">
          <TabsList
            className="grid w-full grid-cols-1"
            style={{ backgroundColor: "#f3f4f6", borderRadius: "6px" }}
          >
            <TabsTrigger
              value="globals"
              style={{ color: "#374151", borderRadius: "4px" }}
            >
              globals.css
            </TabsTrigger>
          </TabsList>

          <TabsContent value="globals" className="mt-4">
            <div className="relative">
              <pre
                style={{
                  padding: "16px",
                  borderRadius: "6px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  overflow: "auto",
                  maxHeight: "400px",
                  fontSize: "0.875rem",
                  color: "#1f2937",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#d1d5db transparent",
                }}
              >
                <code>{generateCSSVariables()}</code>
              </pre>
              <div className="absolute top-2 right-2 flex gap-2 mr-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleCopy}
                  style={{
                    backgroundColor: "white",
                    color: "#4b5563",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                  }}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleDownload}
                  style={{
                    backgroundColor: "white",
                    color: "#4b5563",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-md text-sky-800 text-sm">
          <p className="font-medium mb-1">Requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tailwind CSS v4 or later</li>
            <li>shadcn/ui components</li>
            <li>OKLCH color support</li>
          </ul>
          <p className="mt-2 text-xs">
            These CSS variables use the OKLCH color format for better color
            rendering across browsers.
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => setExportMenuOpen(false)}
            style={{
              backgroundColor: "white",
              color: "#4b5563",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

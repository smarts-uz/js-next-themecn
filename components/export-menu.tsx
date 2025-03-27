"use client"

import { useState } from "react"
import { useThemeStore } from "@/lib/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Download, Check } from "lucide-react"
import { toast } from "sonner"

export function ExportMenu() {
  const { exportMenuOpen, setExportMenuOpen, generateCSSVariables, generateTailwindConfig, generateJSONConfig } =
    useThemeStore()
  const [activeTab, setActiveTab] = useState("css")
  const [copied, setCopied] = useState(false)

  const getActiveCode = () => {
    switch (activeTab) {
      case "css":
        return generateCSSVariables()
      case "tailwind":
        return generateTailwindConfig()
      case "json":
        return generateJSONConfig()
      default:
        return ""
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode())
    setCopied(true)
    toast("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const code = getActiveCode()
    const blob = new Blob([code], {
      type:
        activeTab === "json" ? "application/json" : activeTab === "tailwind" ? "application/javascript" : "text/css",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download =
      activeTab === "json"
        ? "theme-config.json"
        : activeTab === "tailwind"
          ? "tailwind.config.js"
          : "theme-variables.css"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={exportMenuOpen} onOpenChange={setExportMenuOpen}>
      <DialogContent
        className="sm:max-w-[800px]"
        style={{
          backgroundColor: "white",
          color: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#1a1a1a", fontWeight: "600" }}>Export Theme Configuration</DialogTitle>
          <DialogDescription style={{ color: "#6b7280" }}>
            Choose your preferred format to export your theme configuration.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="css" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
            <TabsTrigger value="css" style={{ color: "#374151", borderRadius: "4px" }}>
              CSS Variables
            </TabsTrigger>
            <TabsTrigger value="tailwind" style={{ color: "#374151", borderRadius: "4px" }}>
              Tailwind Config
            </TabsTrigger>
            <TabsTrigger value="json" style={{ color: "#374151", borderRadius: "4px" }}>
              JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="css" className="mt-4">
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
                }}
              >
                <code>{generateCSSVariables()}</code>
              </pre>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  style={{
                    backgroundColor: "white",
                    color: "#4b5563",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                  }}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
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

          <TabsContent value="tailwind" className="mt-4">
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
                }}
              >
                <code>{generateTailwindConfig()}</code>
              </pre>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  style={{
                    backgroundColor: "white",
                    color: "#4b5563",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                  }}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
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

          <TabsContent value="json" className="mt-4">
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
                }}
              >
                <code>{generateJSONConfig()}</code>
              </pre>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  style={{
                    backgroundColor: "white",
                    color: "#4b5563",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                  }}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
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
  )
}


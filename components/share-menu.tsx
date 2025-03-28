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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Link } from "lucide-react";
import { toast } from "sonner";

interface ShareMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareMenu({ open, onOpenChange }: ShareMenuProps) {
  const { getShareableUrl } = useThemeStore();
  const [copied, setCopied] = useState(false);

  const shareUrl = getShareableUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);

    toast("Copied!", {
      description: `Theme URL copied to clipboard`,
      duration: 2000,
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Extract color values from URL for display
  const getColorPreview = () => {
    const state = useThemeStore.getState();
    return [
      { name: "Background", color: state.getHexColor("background") },
      { name: "Foreground", color: state.getHexColor("foreground") },
      { name: "Primary", color: state.getHexColor("primary") },
      { name: "Secondary", color: state.getHexColor("secondary") },
      { name: "Accent", color: state.getHexColor("accent") },
    ];
  };

  const colorPreviews = getColorPreview();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
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
            Share Your Theme
          </DialogTitle>
          <DialogDescription style={{ color: "#6b7280" }}>
            Copy this link to share your current theme with others.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "#6b7280" }}
              />
              <Input
                value={shareUrl}
                readOnly
                style={{
                  paddingLeft: "36px",
                  paddingRight: "64px",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  backgroundColor: "white",
                  border: "1px solid #d1d5db",
                  color: "#1f2937",
                  borderRadius: "6px",
                }}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
                onClick={handleCopy}
                style={{ color: "#4b5563", borderRadius: "4px" }}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Color preview */}
          <div className="grid grid-cols-5 gap-2">
            {colorPreviews.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full mb-1"
                  style={{
                    backgroundColor: item.color,
                    border: "1px solid #d1d5db",
                  }}
                ></div>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              style={{
                backgroundColor: "white",
                color: "#4b5563",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
              }}
            >
              Close
            </Button>

            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: "Check out my themecn theme",
                      text: "I created this theme with themecn. Check it out!",
                      url: shareUrl,
                    })
                    .catch(console.error);
                } else {
                  handleCopy();
                }
              }}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "6px",
              }}
            >
              {"Share"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

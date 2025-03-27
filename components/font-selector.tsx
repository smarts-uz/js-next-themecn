"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontSelectorProps {
  currentFont?: string;
  onChange: (font: string) => void;
  label: string;
}

export function FontSelector({
  currentFont = "Geist",
  onChange,
  label,
}: FontSelectorProps) {
  // Track selected font internally
  const [selectedFont, setSelectedFont] = useState(currentFont || "Geist");

  // Update internal state if prop changes
  useEffect(() => {
    if (currentFont) {
      setSelectedFont(currentFont);
    }
  }, [currentFont]);

  // List of popular Google Fonts
  const fontOptions = [
    "Geist",
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Oswald",
    "Merriweather",
    "Playfair Display",
    "Source Sans Pro",
    "Ubuntu",
    "Nunito",
    "Rubik",
    "Work Sans",
    "PT Sans",
    "Mulish",
    "Quicksand",
    "Fira Sans",
    "Cabin",
  ];

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontOptions
      .filter((font) => font !== "Geist") // Exclude Geist as it's loaded via Next.js font system
      .map((font) => font.replace(/ /g, "+"))
      .join("&family=")}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [fontOptions]);

  // Handle font selection
  const handleFontChange = (value: string) => {
    setSelectedFont(value);
    onChange(value);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor={`font-${label}`}>{label}</Label>

      <Select
        defaultValue="Geist"
        value={selectedFont}
        onValueChange={handleFontChange}
      >
        <SelectTrigger
          id={`font-${label}`}
          className="w-full"
          style={{
            fontFamily: selectedFont,
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            color: "#1f2937",
            borderRadius: "6px",
          }}
        >
          <SelectValue>{selectedFont}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {fontOptions.map((font) => (
            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="text-lg" style={{ fontFamily: selectedFont }}>
        Sample text with {selectedFont}
      </div>
    </div>
  );
}

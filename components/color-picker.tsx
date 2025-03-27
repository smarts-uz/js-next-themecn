"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Pipette } from "lucide-react";
import { toast } from "sonner";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [hue, setHue] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [internalColor, setInternalColor] = useState(color);
  const [hexValue, setHexValue] = useState(color);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingColor, setIsDraggingColor] = useState(false);

  const colorPanelRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);

  // Initialize picker state from the provided color
  useEffect(() => {
    if (color.startsWith("#")) {
      setHexValue(color);
      setInternalColor(color);
      const { h, s, v } = hexToHsv(color);
      setHue(h);

      if (colorPanelRef.current) {
        const width = colorPanelRef.current.clientWidth;
        const height = colorPanelRef.current.clientHeight;
        setPosition({
          x: s * width,
          y: (1 - v) * height,
        });
      }
    }
  }, [color]);

  // Convert hex to HSV
  function hexToHsv(hex: string): { h: number; s: number; v: number } {
    // Remove the # if present
    hex = hex.replace(/^#/, "");

    // Parse the hex values
    const r = Number.parseInt(hex.substring(0, 2), 16) / 255;
    const g = Number.parseInt(hex.substring(2, 4), 16) / 255;
    const b = Number.parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Calculate HSV
    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }

      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return { h, s, v };
  }

  // Convert HSV to hex
  function hsvToHex(h: number, s: number, v: number): string {
    const hi = Math.floor(h / 60) % 6;
    const f = h / 60 - Math.floor(h / 60);
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r = 0,
      g = 0,
      b = 0;

    switch (hi) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Update internal color based on position and hue
  function updateInternalColor(x: number, y: number, h: number) {
    if (!colorPanelRef.current) return;

    const width = colorPanelRef.current.clientWidth;
    const height = colorPanelRef.current.clientHeight;

    // Clamp values
    const clampedX = Math.max(0, Math.min(x, width));
    const clampedY = Math.max(0, Math.min(y, height));

    // Calculate saturation and value
    const s = clampedX / width;
    const v = 1 - clampedY / height;

    // Update hex value
    const newHex = hsvToHex(h, s, v);
    setHexValue(newHex);
    setInternalColor(newHex);

    // Update position
    setPosition({ x: clampedX, y: clampedY });
  }

  // Commit the color change to the parent component
  function commitColorChange() {
    onChange(internalColor);
  }

  // Handle color panel mouse/touch events
  function handleColorPanelMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    setIsDraggingColor(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateInternalColor(x, y, hue);
  }

  // Handle hue slider mouse/touch events
  function handleHueSliderMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    setIsDraggingHue(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const h = (x / width) * 360;
    setHue(h);
    updateInternalColor(position.x, position.y, h);
  }

  // Handle mouse/touch move
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDraggingColor && colorPanelRef.current) {
        const rect = colorPanelRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        updateInternalColor(x, y, hue);
      } else if (isDraggingHue && hueSliderRef.current) {
        const rect = hueSliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const h = Math.max(0, Math.min((x / width) * 360, 360));
        setHue(h);
        updateInternalColor(position.x, position.y, h);
      }
    }

    function handleMouseUp() {
      if (isDraggingColor || isDraggingHue) {
        // Commit the color change when dragging stops
        commitColorChange();
      }
      setIsDraggingColor(false);
      setIsDraggingHue(false);
    }

    if (isDraggingColor || isDraggingHue) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDraggingColor,
    isDraggingHue,
    hue,
    position.x,
    position.y,
    commitColorChange,
    updateInternalColor,
  ]);

  // Handle hex input change
  function handleHexChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setHexValue(value);

    // Only update if it's a valid hex color
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setInternalColor(value);

      // Only commit the change when the input loses focus or Enter is pressed
      // This is handled in the onBlur and onKeyDown handlers
    }
  }

  // Handle hex input blur (commit change)
  function handleHexBlur() {
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
      commitColorChange();

      // Update hue and position
      const { h, s, v } = hexToHsv(hexValue);
      setHue(h);

      if (colorPanelRef.current) {
        const width = colorPanelRef.current.clientWidth;
        const height = colorPanelRef.current.clientHeight;
        setPosition({
          x: s * width,
          y: (1 - v) * height,
        });
      }
    } else {
      // Reset to the last valid color
      setHexValue(internalColor);
    }
  }

  // Handle hex input key press (commit on Enter)
  function handleHexKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleHexBlur();
    }
  }

  // Copy color to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(hexValue);
    toast("Copied!", {
      description: `${hexValue} copied to clipboard`,
      duration: 2000,
    });
  }

  // Use eyedropper if available
  async function useEyeDropper() {
    if (!("EyeDropper" in window)) {
      toast.error("Not supported", {
        description: "Eyedropper is not supported in your browser",
        duration: 3000,
      });
      return;
    }

    try {
      // @ts-expect-error - EyeDropper is not in the TypeScript DOM types yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setHexValue(result.sRGBHex);
      setInternalColor(result.sRGBHex);
      commitColorChange();

      // Update hue and position
      const { h, s, v } = hexToHsv(result.sRGBHex);
      setHue(h);

      if (colorPanelRef.current) {
        const width = colorPanelRef.current.clientWidth;
        const height = colorPanelRef.current.clientHeight;
        setPosition({
          x: s * width,
          y: (1 - v) * height,
        });
      }
    } catch (e) {
      console.error("Error using eyedropper", e);
    }
  }

  return (
    <div
      className="w-full space-y-4 p-4 bg-white text-gray-900"
      style={{ borderRadius: "8px" }}
    >
      {/* Color panel */}
      <div
        ref={colorPanelRef}
        className="relative w-full h-48 cursor-crosshair touch-none"
        style={{
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
          backgroundImage: `
          linear-gradient(to right, #fff, transparent),
          linear-gradient(to bottom, transparent, #000)
        `,
          borderRadius: "6px",
        }}
        onMouseDown={handleColorPanelMouseDown}
      >
        {/* Color selector */}
        <div
          className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-md pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
            backgroundColor: internalColor,
          }}
        />
      </div>

      {/* Hue slider */}
      <div
        ref={hueSliderRef}
        className="relative w-full h-6 cursor-pointer touch-none"
        style={{
          backgroundImage: `linear-gradient(to right, 
          #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)`,
          borderRadius: "6px",
        }}
        onMouseDown={handleHueSliderMouseDown}
      >
        {/* Hue selector */}
        <div
          className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-md pointer-events-none"
          style={{
            left: (hue / 360) * 100 + "%",
            top: "50%",
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
          }}
        />
      </div>

      {/* Hex input and tools */}
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2 text-gray-900">HEX</span>
          <input
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            onBlur={handleHexBlur}
            onKeyDown={handleHexKeyDown}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            pattern="^#[0-9A-F]{6}$"
            maxLength={7}
            style={{ borderRadius: "6px" }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300"
            style={{ borderRadius: "6px" }}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy color</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={useEyeDropper}
            className="h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300"
            style={{ borderRadius: "6px" }}
          >
            <Pipette className="h-4 w-4" />
            <span className="sr-only">Pick color</span>
          </Button>

          <div
            className="flex-1 h-10 border border-gray-300"
            style={{ backgroundColor: internalColor, borderRadius: "6px" }}
          />
        </div>
      </div>
    </div>
  );
}

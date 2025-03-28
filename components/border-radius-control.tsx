"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useThemeStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export function BorderRadiusControl() {
  const { borderRadius, updateBorderRadius } = useThemeStore();
  const [value, setValue] = useState(borderRadius);

  // Sync with store value
  useEffect(() => {
    setValue(borderRadius);
  }, [borderRadius]);

  const handleSliderChange = (newValue: number[]) => {
    const radius = newValue[0];
    setValue(radius);
    updateBorderRadius(radius);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const radius = Number.parseFloat(e.target.value);
    if (!isNaN(radius) && radius >= 0 && radius <= 1) {
      setValue(radius);
      updateBorderRadius(radius);
    }
  };

  const presetValues = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleSliderChange}
        />
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={0}
          max={1}
          step={0.01}
          className="w-25 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            color: "#1f2937",
            borderRadius: "6px",
          }}
        />
      </div>

      <div className="flex justify-between">
        {presetValues.map((preset) => (
          <button
            key={preset}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => {
              setValue(preset);
              updateBorderRadius(preset);
            }}
          >
            <div
              className={`w-8 h-8 border border-gray-300 bg-white transition-all duration-200 ${
                preset === 0
                  ? "rounded-none"
                  : preset === 0.25
                  ? "rounded-[0.25rem]"
                  : preset === 0.5
                  ? "rounded-[0.5rem]"
                  : preset === 0.75
                  ? "rounded-[0.75rem]"
                  : "rounded-[1rem]"
              }`}
            />
            <span className="text-xs text-gray-600">{preset}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

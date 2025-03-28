import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useThemeStore } from "@/lib/store";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThemeSaveDialog = ({ open, onOpenChange }: Props) => {
  const { saveCurrentAsTheme } = useThemeStore();
  const [newThemeName, setNewThemeName] = useState("");

  const handleSaveTheme = () => {
    if (newThemeName.trim()) {
      saveCurrentAsTheme(newThemeName.trim());
      onOpenChange(false);
      setNewThemeName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        style={{
          backgroundColor: "white",
          color: "#1a1a1a",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#1a1a1a", fontWeight: "600" }}>
            Save Current Theme
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="theme-name"
              className="text-right"
              style={{ color: "#374151" }}
            >
              Name
            </label>
            <Input
              id="theme-name"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              placeholder="My Custom Theme"
              className="col-span-3"
              style={{
                backgroundColor: "white",
                border: "1px solid #d1d5db",
                color: "#1f2937",
                borderRadius: "6px",
              }}
            />
          </div>
        </div>
        <DialogFooter>
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
            Cancel
          </Button>
          <Button
            onClick={handleSaveTheme}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "6px",
            }}
          >
            Save Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

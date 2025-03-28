import { Icons } from "./icons";

export function ThemeLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading theme...</p>
      </div>
    </div>
  );
}

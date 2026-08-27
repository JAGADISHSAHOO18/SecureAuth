import type { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

function ThemeButton({
  label,
  children,
  active,
  onClick,
}: {
  label: string;
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Use ${label} theme`}
      aria-pressed={active}
      title={`Use ${label} theme`}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
        "hover:-translate-y-0.5 hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-md",
        "active:translate-y-0 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-primary text-primary-foreground shadow-sm",
      )}
    >
      {children}
    </button>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-border bg-card/80 p-1 shadow-sm backdrop-blur"
      aria-label="Theme selection"
    >
      <ThemeButton
        label="light"
        active={theme === "light"}
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4" />
      </ThemeButton>
      <ThemeButton
        label="dark"
        active={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4" />
      </ThemeButton>
    </div>
  );
}

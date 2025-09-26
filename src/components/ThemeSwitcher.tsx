"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Ship } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = ["light", "dark", "ocean"] as const;
type Theme = (typeof themes)[number];

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const [theme, setTheme] = useState<Theme>("light");

  // Carica il tema salvato da localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved && themes.includes(saved)) {
      setTheme(saved);
      document.documentElement.className = saved;
    }
  }, []);

  // Aggiorna il tema e salva in localStorage
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  // Cicla tra i temi
  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    changeTheme(nextTheme);
  };

  if (theme === "light") {
    return (
      <Moon
        className={cn("size-6 text-foreground", className)}
        onClick={cycleTheme}
      />
    );
  }
  if (theme === "dark") {
    return (
      <Ship
        className={cn("size-6 text-foreground", className)}
        onClick={cycleTheme}
      />
    );
  }
  if (theme === "ocean") {
    return (
      <Sun
        className={cn("size-6 text-foreground", className)}
        onClick={cycleTheme}
      />
    );
  }

  return null;
};

export default ThemeSwitcher;

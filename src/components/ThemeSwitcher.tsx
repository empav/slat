"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Ship } from "lucide-react";

const themes = ["light", "dark", "ocean"] as const;
type Theme = (typeof themes)[number];

export function ThemeSwitcher() {
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
    return <Moon className="size-6" onClick={cycleTheme} />;
  }
  if (theme === "dark") {
    return <Ship className="size-6" onClick={cycleTheme} />;
  }
  if (theme === "ocean") {
    return <Sun className="size-6" onClick={cycleTheme} />;
  }

  return null;
}

"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, []);

  function applyTheme(nextDark: boolean) {
    const root = document.documentElement;
    if (nextDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
  }

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <>
          <Sun className="size-4" aria-hidden />
          <span className="sr-only">Switch to light</span>
        </>
      ) : (
        <>
          <Moon className="size-4" aria-hidden />
          <span className="sr-only">Switch to dark</span>
        </>
      )}
    </button>
  );
}



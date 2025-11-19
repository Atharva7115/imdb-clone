import React from "react";
import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="px-3 py-1 rounded-md border transition-colors duration-300
                 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                 border-gray-300 dark:border-gray-700"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

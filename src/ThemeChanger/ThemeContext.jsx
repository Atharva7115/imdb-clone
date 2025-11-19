import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "user_theme"; // 'light' | 'dark'
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // lazy init from localStorage so initial render respects saved preference
  const [theme, setTheme] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // ignore storage errors
    }
   
    document.documentElement.classList.toggle("dark", theme === "dark");
      console.log("ThemeProvider: theme =", theme);
  console.log("HTML classes:", document.documentElement.className);
  console.log("localStorage user_theme:", localStorage.getItem(STORAGE_KEY));
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// small hook
export function useTheme() {
  return useContext(ThemeContext);
}
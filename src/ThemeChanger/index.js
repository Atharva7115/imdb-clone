import React from "react";
import ThemeToggle from "./components/ThemeToggle";
import "../index.css";

export default function ThemeApp() {
  return (
    <div className="app-root min-h-screen transition-colors duration-500">
      <header className="max-w-4xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/mnt/data/b008d04c-3c26-4641-a8f2-b8c0081a7261.png"
            alt="logo"
            className="w-12 h-12 rounded-md object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">Theme Switcher</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Toggle between Light and Dark modes (persisted).
            </p>
          </div>
        </div>

        <ThemeToggle />
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <section className="p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 transition-colors duration-500">
          <h2 className="text-xl font-semibold mb-3">Demo Content</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            This page demonstrates global theme switching using React Context.
            The selected theme is saved to localStorage and reapplied
            on page load.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2">Panel A</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Smooth CSS transition is applied when switching themes.
              </p>
            </div>

            <div className="p-4 rounded border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2">Panel B</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Theme is accessible from any component via <code>useTheme()</code>.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

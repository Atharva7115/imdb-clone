import React, { Suspense } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

// Lazy load mini-apps (fast initial load)
const MoviesApp = React.lazy(() => import("./movies"));
const TodoApp = React.lazy(() => import("./todos"));
const ThemeApp = React.lazy(() => import("./ThemeChanger"));

export default function App() {
  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium ${
      isActive ? "bg-yellow-400 text-black" : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">
            Mini Projects Hub
          </h1>

          {/* NAVIGATION */}
          <nav className="flex gap-4">
            <NavLink to="/movies" className={navLinkClass}>
              🎬 Movies
            </NavLink>
            <NavLink to="/todo" className={navLinkClass}>
              📝 Todo
            </NavLink>
            
            <NavLink to="/theme" className={navLinkClass}>  
              🎨 Theme
            </NavLink>
          </nav>
        </header>

        {/* ROUTES */}
        <main className="mt-4">
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="text-center text-gray-300 py-20">
                    Select an app from above 👆
                  </div>
                }
              />

              <Route path="/movies/*" element={<MoviesApp />} />
              <Route path="/todo/*" element={<TodoApp />} />
                <Route path="/theme/*" element={<ThemeApp />} />
            </Routes>
          </Suspense>
        </main>

      </div>
    </div>
  );
}

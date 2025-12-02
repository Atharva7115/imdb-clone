import React, { Suspense } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import ThemeToggle from "./ThemeChanger/components/ThemeToggle";
import { useAuth } from "./auth/AuthContext";   // ✅ import

// Lazy load mini-apps (fast initial load)
const MoviesApp = React.lazy(() => import("./movies"));
const TodoApp = React.lazy(() => import("./todos"));
const ThemeApp = React.lazy(() => import("./ThemeChanger"));
const NotesApp = React.lazy(() => import("./notes"));
const FavoritesPage = React.lazy(() => import("./movies/Favorites"));
const MovieDetails = React.lazy(() => import("./movies/MovieDetails"));

export default function App() {
  // ✅ hooks must be inside component
  const { user, loading, loginWithGoogle, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium ${
      isActive ? "bg-yellow-400 text-black" : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-4 md:mb-2">
              Mini Projects Hub
            </h1>

            {/* NAVIGATION */}
            <nav className="flex flex-wrap gap-4">
              <NavLink to="/movies" className={navLinkClass}>
                🎬 Movies
              </NavLink>
              <NavLink to="/favorites" className={navLinkClass}>
                ❤️ Favorites
              </NavLink>
              <NavLink to="/todo" className={navLinkClass}>
                📝 Todo
              </NavLink>
              <NavLink to="/theme" className={navLinkClass}>
                🎨 Theme
              </NavLink>
              <NavLink to="/notes" className={navLinkClass}>
                Notes
              </NavLink>
            </nav>
          </div>

          {/* RIGHT SIDE: THEME + AUTH INFO */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            <ThemeToggle />

            {loading ? (
              <span className="text-xs text-gray-400">Checking login…</span>
            ) : user ? (
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || user.email}
                    className="w-8 h-8 rounded-full border border-yellow-400 object-cover"
                  />
                )}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="text-xs text-gray-300 hover:text-yellow-400"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-3 py-1 rounded-md bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-500"
              >
                Login
              </button>
            )}
          </div>
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

              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/movies" element={<MoviesApp />} />
              <Route path="/movies/:id" element={<MovieDetails />} />

              <Route path="/todo/*" element={<TodoApp />} />
              <Route path="/theme/*" element={<ThemeApp />} />
              <Route path="/notes" element={<NotesApp />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// src/movies/MoviesApp.jsx
import React, { useEffect, useState, useRef } from "react";
import { getPopularMovies, fetchMovies } from "../services/api";
import "../App.css";
import MovieCard from "./components/MovieCard";

const mapMovies = (list = []) =>
  list.map((m) => ({
    id: m.id,
    title: m.title || m.name || "Untitled",
    year: m.release_date ? m.release_date.slice(0, 4) : "—",
    rating: m.vote_average ? String(m.vote_average) : "—",
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
  }));

export default function MoviesApp() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // search-related state
  const [query, setQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  // keep reference to debounce timer
  const debounceRef = useRef(null);

  // load popular movies on mount or when query is cleared
  const loadPopular = async () => {
    setLoading(true);
    try {
      const res = await getPopularMovies();
      setMovies(mapMovies(res));
      setNoResults((res || []).length === 0);
    } catch (err) {
      console.error(err);
      setMovies([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopular();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounced search effect
  useEffect(() => {
    // clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // if query empty -> show popular
    const trimmed = query.trim();
    if (!trimmed) {
      // slight delay so UI feels smooth
      debounceRef.current = setTimeout(() => {
        loadPopular();
      }, 200);
      return () => clearTimeout(debounceRef.current);
    }

    // otherwise debounce the search API call
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetchMovies(trimmed);
        const mapped = mapMovies(res);
        setMovies(mapped);
        setNoResults((res || []).length === 0);
      } catch (err) {
        console.error(err);
        setMovies([]);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-start justify-center py-10">
      <div className="w-full max-w-6xl px-4">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/mnt/data/b008d04c-3c26-4641-a8f2-b8c0081a7261.png"
              alt="logo"
              className="w-12 h-12 rounded-md object-cover"
            />
            <h1 className="text-3xl font-bold text-yellow-400">🎬 Movies</h1>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full max-w-xl flex items-center gap-2"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies by title..."
              className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 outline-none"
              aria-label="Search movies"
            />
            <button
              type="button"
              onClick={() => {
                // immediate search trigger (clears debounce)
                if (debounceRef.current) clearTimeout(debounceRef.current);
                setQuery((q) => q.trim()); // triggers effect immediately
              }}
              className="px-4 py-2 rounded-md bg-yellow-500 text-black font-medium"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                // load popular immediately
                if (debounceRef.current) clearTimeout(debounceRef.current);
                loadPopular();
              }}
              className="ml-2 px-3 py-2 rounded-md border border-gray-700 text-gray-300"
            >
              Reset
            </button>
          </form>
        </header>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <>
            {noResults && query.trim() !== "" ? (
              <div className="text-center text-gray-400 py-10">No Results Found</div>
            ) : (
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((m) => (
                  <MovieCard key={m.id || m.title} movie={m} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

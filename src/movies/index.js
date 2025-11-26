import React, { useEffect, useState, useRef } from "react";
import { getPopularMovies, fetchMovies } from "../services/api";
import "../App.css";
import MovieCard from "./components/MovieCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

const mapMovies = (list = []) =>
  list.map((m) => ({
    id: m.id,
    title: m.title || m.name || "Untitled",
    year: m.release_date ? m.release_date.slice(0, 4) : "—",
    rating: m.vote_average ? String(m.vote_average) : "—",
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : null,
  }));

export default function MoviesApp() {
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);        // main loading
  const [loadingMore, setLoadingMore] = useState(false); // Load More spinner
  const [error, setError] = useState(null);             // error message string

  // search-related state
  const [query, setQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mode, setMode] = useState("popular"); // "popular" | "search"

  // debounce timer ref
  const debounceRef = useRef(null);

  // -------- helpers (popular + search, paginated) --------

  const loadPopular = async (pageNumber = 1, append = false) => {
    try {
      setError(null); // clear previous error
      append ? setLoadingMore(true) : setLoading(true);

      const { results, totalPages } = await getPopularMovies(pageNumber);
      const mapped = mapMovies(results);

      setTotalPages(totalPages);
      setNoResults(mapped.length === 0 && pageNumber === 1);
      setMovies((prev) => (append ? [...prev, ...mapped] : mapped));
    } catch (err) {
      console.error("Error loading popular movies:", err);
      if (!append) {
        setMovies([]);
        setNoResults(true);
        setError("Failed to load popular movies. Please try again.");
      }
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  const loadSearch = async (searchTerm, pageNumber = 1, append = false) => {
    try {
      setError(null); // clear previous error
      append ? setLoadingMore(true) : setLoading(true);

      const { results, totalPages } = await fetchMovies(searchTerm, pageNumber);
      const mapped = mapMovies(results);

      setTotalPages(totalPages);
      setNoResults(mapped.length === 0 && pageNumber === 1);
      setMovies((prev) => (append ? [...prev, ...mapped] : mapped));
    } catch (err) {
      console.error(`Error searching movies for "${searchTerm}":`, err);
      if (!append) {
        setMovies([]);
        setNoResults(true);
        setError(`Failed to search movies for "${searchTerm}". Please try again.`);
      }
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    setMode("popular");
    setPage(1);
    loadPopular(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounced search behavior
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();

    if (!trimmed) {
      // back to popular
      debounceRef.current = setTimeout(() => {
        setMode("popular");
        setPage(1);
        loadPopular(1, false);
      }, 200);
      return () => clearTimeout(debounceRef.current);
    }

    // search mode
    debounceRef.current = setTimeout(() => {
      setMode("search");
      setPage(1);
      loadSearch(trimmed, 1, false);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const hasMore = page < totalPages;

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);

    if (mode === "popular") {
      loadPopular(nextPage, true);
    } else {
      loadSearch(query.trim(), nextPage, true);
    }
  };

  const handleRetry = () => {
    if (mode === "popular") {
      loadPopular(page || 1, false);
    } else {
      const trimmed = query.trim();
      if (trimmed) {
        loadSearch(trimmed, page || 1, false);
      } else {
        loadPopular(1, false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Big white card wrapping header + grid + button */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 px-4 sm:px-8 py-6 space-y-6">
          {/* HEADER + SEARCH */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/mnt/data/b008d04c-3c26-4641-a8f2-b8c0081a7261.png"
                alt="logo"
                className="w-12 h-12 rounded-xl object-cover shadow-md"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500">
                  🎬 {mode === "popular" ? "Popular Movies" : "Search Results"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Browse trending titles or search for your favorite movies.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies by title..."
                className="flex-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label="Search movies"
              />
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  setMode("popular");
                  setPage(1);
                  loadPopular(1, false);
                }}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </form>
          </header>

          {/* CONTENT */}
          {loading && !loadingMore ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : noResults ? (
            <EmptyState
              message={
                query.trim()
                  ? "No movies found for this search."
                  : "No movies available to display."
              }
            />
          ) : (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((m) => (
                  <MovieCard key={m.id || m.title} movie={m} />
                ))}
              </section>

              {hasMore && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-2 rounded-full bg-yellow-400 text-black
                               text-sm font-semibold shadow-md hover:shadow-lg
                               hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed
                               transition-all duration-200"
                  >
                    {loadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

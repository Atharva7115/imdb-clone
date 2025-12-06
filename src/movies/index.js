import React, { useEffect, useState, useRef } from "react";
import { getPopularMovies, fetchMovies } from "../services/api";
import "../App.css";
import MovieCard from "./components/MovieCard";
import MovieSkeletonGrid from "./components/MovieSkeletoGrid";

import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

// TMDB genre IDs → names (common subset)
const GENRES = [
  { id: 0, name: "All" },
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

const mapMovies = (list = []) =>
  list.map((m) => ({
    id: m.id,
    title: m.title || m.name || "Untitled",
    year: m.release_date ? m.release_date.slice(0, 4) : "—",
    rating: m.vote_average ?? 0, // keep as number (fine for display)
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : null,
    genreIds: m.genre_ids || [],
    popularity: m.popularity ?? 0,
    releaseDate: m.release_date || "",
  }));

export default function MoviesApp() {
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);         // main loading
  const [loadingMore, setLoadingMore] = useState(false); // Load More spinner
  const [error, setError] = useState(null);              // error message string

  // search-related state
  const [query, setQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mode, setMode] = useState("popular"); // "popular" | "search"

  // filters + sorting
  const [selectedGenre, setSelectedGenre] = useState(0); // 0 = All
  const [minRating, setMinRating] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [sortBy, setSortBy] = useState("popularity");   // popularity | newest | rating

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

  // -------- FILTER + SORT LOGIC (client-side) --------

  const applyFiltersAndSort = (list) => {
    let filtered = [...list];

    // Genre filter
    if (selectedGenre !== 0) {
      filtered = filtered.filter((m) => m.genreIds.includes(selectedGenre));
    }

    // Min rating
    if (minRating) {
      const min = parseFloat(minRating);
      if (!Number.isNaN(min)) {
        filtered = filtered.filter((m) => (m.rating ?? 0) >= min);
      }
    }

    // Year range
    if (minYear || maxYear) {
      const minY = minYear ? parseInt(minYear, 10) : 0;
      const maxY = maxYear ? parseInt(maxYear, 10) : 9999;
      filtered = filtered.filter((m) => {
        const y = m.year && m.year !== "—" ? parseInt(m.year, 10) : null;
        if (!y) return false;
        return y >= minY && y <= maxY;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }
      if (sortBy === "newest") {
        const ay = a.year && a.year !== "—" ? parseInt(a.year, 10) : 0;
        const by = b.year && b.year !== "—" ? parseInt(b.year, 10) : 0;
        return by - ay;
      }
      // default: popularity
      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });

    return filtered;
  };

  const displayMovies = applyFiltersAndSort(movies);
  const filteredEmpty =
    !loading && !error && !noResults && movies.length > 0 && displayMovies.length === 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Big white card wrapping header + filters + grid + button */}
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
                  Browse trending titles or search and filter like IMDb / Netflix.
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

          {/* FILTER BAR */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {/* Genre */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(Number(e.target.value))}
                className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 outline-none"
              >
                {GENRES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Min Rating (0–10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 outline-none"
                placeholder="e.g. 7.5"
              />
            </div>

            {/* Year Range */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Year Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  className="w-1/2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 outline-none"
                  placeholder="From"
                />
                <input
                  type="number"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  className="w-1/2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 outline-none"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 outline-none"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </section>

          {/* CONTENT */}
          {loading && !loadingMore ? (
            <MovieSkeletonGrid />
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
          ) : filteredEmpty ? (
            <EmptyState message="No movies match the selected filters." />
          ) : (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayMovies.map((m) => (
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

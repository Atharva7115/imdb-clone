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
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : null,
  }));

export default function MoviesApp() {
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);        // main loading
  const [loadingMore, setLoadingMore] = useState(false); // "Load More" loading

  // search-related state
  const [query, setQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mode, setMode] = useState("popular"); // "popular" | "search"

  // keep reference to debounce timer
  const debounceRef = useRef(null);

  // ---------- helpers ----------

  const loadPopular = async (pageNumber = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const { results, totalPages } = await getPopularMovies(pageNumber);
      const mapped = mapMovies(results);

      setTotalPages(totalPages);
      setNoResults(mapped.length === 0 && pageNumber === 1);

      setMovies((prev) => (append ? [...prev, ...mapped] : mapped));
    } catch (err) {
      console.error(err);
      if (!append) {
        setMovies([]);
        setNoResults(true);
      }
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

  const loadSearch = async (searchTerm, pageNumber = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const { results, totalPages } = await fetchMovies(searchTerm, pageNumber);
      const mapped = mapMovies(results);

      setTotalPages(totalPages);
      setNoResults(mapped.length === 0 && pageNumber === 1);

      setMovies((prev) => (append ? [...prev, ...mapped] : mapped));
    } catch (err) {
      console.error(err);
      if (!append) {
        setMovies([]);
        setNoResults(true);
      }
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

  // initial popular load
  useEffect(() => {
    setMode("popular");
    setPage(1);
    loadPopular(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();

    // if query empty -> show popular
    if (!trimmed) {
      debounceRef.current = setTimeout(() => {
        setMode("popular");
        setPage(1);
        loadPopular(1, false);
      }, 200);
      return () => clearTimeout(debounceRef.current);
    }

    // otherwise debounce the search API call
    debounceRef.current = setTimeout(() => {
      setMode("search");
      setPage(1);
      loadSearch(trimmed, 1, false);
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const hasMore = page < totalPages;

  const handleLoadMore = () => {
    if (loadingMore) return;
    if (!hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);

    if (mode === "popular") {
      loadPopular(nextPage, true);
    } else {
      loadSearch(query.trim(), nextPage, true);
    }
  };

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
            <h1 className="text-3xl font-bold text-yellow-400">
              🎬 {mode === "popular" ? "Popular Movies" : "Search Results"}
            </h1>
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
                setQuery("");
                if (debounceRef.current) clearTimeout(debounceRef.current);
                setMode("popular");
                setPage(1);
                loadPopular(1, false);
              }}
              className="ml-2 px-3 py-2 rounded-md border border-gray-700 text-gray-300"
            >
              Reset
            </button>
          </form>
        </header>

        {loading && !loadingMore ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <>
            {noResults && query.trim() !== "" ? (
              <div className="text-center text-gray-400 py-10">
                No Results Found
              </div>
            ) : (
              <>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {movies.map((m) => (
                    <MovieCard key={m.id || m.title} movie={m} />
                  ))}
                </section>

                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm disabled:opacity-60"
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

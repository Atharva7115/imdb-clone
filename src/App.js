
import React, { useState } from "react";
import { useEffect } from "react";
import { getPopularMovies } from "./services/api";   
import './App.css';
import MovieCard from './components/MovieCard';

function App() {
    const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

   const map = (list = []) =>
    list.map((m) => ({
      title: m.title || m.name || "Untitled",
      year: m.release_date ? m.release_date.slice(0, 4) : "—",
      rating: m.vote_average ? String(m.vote_average) : "—",
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
    }));

  useEffect(() => {
    setLoading(true);
    getPopularMovies()
      .then((res) => setMovies(map(res)))
      .finally(() => setLoading(false));
  }, []);

 

  return (
  <div className="min-h-screen bg-gray-900 text-white flex items-start justify-center py-10">
      <div className="w-full max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">🎬 Popular Movies</h1>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((m, i) => (
              <MovieCard key={i} movie={m} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;

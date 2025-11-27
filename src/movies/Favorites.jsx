import React from "react";
import { useFavorites } from "./context/FavoritesContext";
import MovieCard from "./components/MovieCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen py-10 px-4 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-500 mb-6">
          ❤️ Favorite Movies
        </h1>

        {favorites.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No favorites yet. Add some movies!
          </p>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

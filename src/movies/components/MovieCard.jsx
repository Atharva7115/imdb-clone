import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { id, title, year, rating, poster } = movie;

  const inWatchlist = isFavorite(id);

  return (
    <article
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl
                 overflow-hidden transform hover:-translate-y-1 transition-all duration-300
                 border border-gray-200/60 dark:border-gray-700/60 relative"
    >
      {/* WATCHLIST BUTTON (does NOT navigate) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleFavorite(movie);
        }}
        className="absolute top-3 right-3 z-20 flex items-center gap-1
                   px-2 py-1 rounded-full bg-black/70 text-xs sm:text-sm
                   text-white backdrop-blur-sm hover:scale-105
                   transition-transform"
      >
        {inWatchlist ? (
          <>
            <span>✓</span>
            <span>In Watchlist</span>
          </>
        ) : (
          <>
            <span>＋</span>
            <span>Watchlist</span>
          </>
        )}
      </button>

      {/* CLICKABLE PART */}
      <Link to={`/movies/${id}`}>
        <div className="relative h-72 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-300">
              No image
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        </div>

        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 truncate">
            {title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{year}</span>
            <span className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="font-medium">{rating}</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

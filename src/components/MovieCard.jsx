
import React from "react";

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-gray-800 text-white rounded-2xl shadow-md overflow-hidden w-64 transform transition duration-300 hover:scale-105 hover:shadow-lg">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-80 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
          <p>{movie.year}</p>
          <p className="text-yellow-400 font-semibold">⭐ {movie.rating}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

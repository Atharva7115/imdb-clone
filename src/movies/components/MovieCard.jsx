


// const MovieCard = ({ movie }) => {
//   return (
//     <div className="bg-gray-800 text-white rounded-2xl shadow-md overflow-hidden w-64 transform transition duration-300 hover:scale-105 hover:shadow-lg">
//       <img
//         src={movie.poster}
//         alt={movie.title}
//         className="w-full h-80 object-cover"
//       />
//       <div className="p-4">
//         <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
//         <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
//           <p>{movie.year}</p>
//           <p className="text-yellow-400 font-semibold">⭐ {movie.rating}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieCard;
import React from "react";

export default function MovieCard({ movie }) {
  const { title, year, rating, poster } = movie;

  return (
    <article
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl
                 overflow-hidden transform hover:-translate-y-1 transition-all duration-300
                 border border-gray-200/60 dark:border-gray-700/60"
    >
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

        {/* subtle gradient overlay at bottom */}
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
    </article>
  );
}

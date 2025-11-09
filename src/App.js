
import React, { useState } from "react";
import './App.css';
import MovieCard from './components/MovieCard';

function App() {
  const movies = [
    {
      title: "Inception",
      year: "2010",
      rating: "8.8",
      poster: "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg",
    },
    {
      title: "Interstellar",
      year: "2014",
      rating: "8.6",
      poster: "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SL1500_.jpg",
    },
    {
      title: "The Dark Knight",
      year: "2008",
      rating: "9.0",
      poster: "https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_.jpg"
    }
  ];

   const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(null);

  // --- URL Validation Regex ---
  const urlRegex =
    /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(:\d+)?(\/[^\s]*)?$/i;

  const handleChange = (e) => {
    const input = e.target.value;
    setUrl(input);
    if (input.trim() === "") setIsValid(null);
    else setIsValid(urlRegex.test(input));
  };


  return (
     <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 space-y-10">
      {/* 🎬 IMDb Clone Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">
          🎬 IMDb Clone
        </h1>
        <div className="flex flex-wrap justify-center gap-6">
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
      </div>

      {/* 🔍 URL Validator Section */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          URL Validator 🔍
        </h2>

        <input
          type="text"
          value={url}
          onChange={handleChange}
          placeholder="Enter URL (e.g. https://example.com)"
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {isValid !== null && (
          <p
            className={`mt-3 text-center font-semibold ${
              isValid ? "text-green-400" : "text-red-400"
            }`}
          >
            {isValid ? "✅ Valid URL" : "❌ Invalid URL"}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;

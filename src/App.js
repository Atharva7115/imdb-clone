import logo from './logo.svg';
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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">🎬 IMDb Clone</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
    </div>

  );
}

export default App;

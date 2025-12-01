import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import ReviewSection from "./components/ReviewSection";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getMovieDetails(id);
        if (!data) {
          setError("Movie not found.");
        } else {
          setMovie(data);
        }
      } catch (e) {
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (error || !movie) return <ErrorMessage message={error || "Movie not found."} />;

  const {
    poster_path,
    title,
    overview,
    release_date,
    runtime,
    vote_average,
    genres = [],
    credits,
  } = movie;

  const poster = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          to="/movies"
          className="text-yellow-400 hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Movies
        </Link>

        {/* BIG WHITE CARD WRAPPING EVERYTHING */}
        <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/70 dark:border-gray-700/70 overflow-hidden">
          {/* Poster + main info */}
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-72 flex-shrink-0">
              {poster ? (
                <img
                  src={poster}
                  alt={title}
                  className="w-full rounded-xl shadow-md"
                />
              ) : (
                <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-yellow-500">
                {title}
              </h1>

              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Release Year: {release_date?.slice(0, 4) || "—"}</p>
                <p>Runtime: {runtime ? `${runtime} mins` : "—"}</p>
                <p className="flex items-center gap-1">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="font-semibold">
                    {vote_average ? vote_average.toFixed(1) : "—"}
                  </span>
                  <span>/10</span>
                </p>
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-semibold"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div>
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mt-2">
                  {overview || "No overview available for this movie."}
                </p>
              </div>
            </div>
          </div>

          {/* CAST SECTION INSIDE THE SAME CARD */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 md:px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-3">
              Top Cast
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {credits?.cast?.slice(0, 12).map((actor) => (
                <div
                  key={actor.cast_id || actor.id}
                  className="w-24 flex-shrink-0 text-center text-xs"
                >
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        ?
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {actor.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 truncate">
                    {actor.character}
                  </p>
                </div>
              ))}
              {!credits?.cast?.length && (
                <p className="text-gray-500 dark:text-gray-400">
                  Cast information not available.
                </p>
              )}
            </div>
          </div>
    <ReviewSection movieId={id} movieTitle={title} />

        </section>
      </div>
    </div>
  );
}

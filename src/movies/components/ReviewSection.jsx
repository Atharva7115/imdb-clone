import React, { useEffect, useState } from "react";

const REVIEWS_KEY = "movie_reviews_v1";
const USER_KEY = "movie_username";

// helpers to read/write from localStorage
function loadAllReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllReviews(data) {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export default function ReviewSection({ movieId, movieTitle }) {
  const [reviews, setReviews] = useState([]);
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // load username + reviews on mount / when movieId changes
  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_KEY);
      if (u) setUsername(u);
    } catch {}

    const all = loadAllReviews();
    setReviews(all[movieId] || []);
  }, [movieId]);

  // persist username when it changes
  useEffect(() => {
    try {
      if (username.trim()) {
        localStorage.setItem(USER_KEY, username.trim());
      }
    } catch {}
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const name = username.trim();
    const text = comment.trim();
    const numRating = Number(rating);

    if (!name) {
      setError("Please enter a username.");
      return;
    }
    if (!text) {
      setError("Please write a short review.");
      return;
    }
    if (!numRating || numRating < 1 || numRating > 10) {
      setError("Rating must be between 1 and 10.");
      return;
    }

    const newReview = {
      id: Date.now(),
      username: name,
      rating: numRating,
      comment: text,
      createdAt: new Date().toISOString(),
    };

    // update local state
    setReviews((prev) => {
      const updated = [newReview, ...prev];

      // update localStorage for this movie
      const all = loadAllReviews();
      all[movieId] = updated;
      saveAllReviews(all);

      return updated;
    });

    setComment("");
    setRating(10);
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            User Reviews
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share your thoughts about <span className="font-medium">{movieTitle}</span>.
          </p>
        </div>

        {/* Average rating summary */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 font-bold">
              {avgRating ?? "–"}
            </span>
            <span className="text-sm text-gray-500"> /10</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {reviews.length > 0
              ? `${reviews.length} user review${reviews.length > 1 ? "s" : ""}`
              : "No reviews yet"}
          </div>
        </div>
      </div>

      {/* Review form */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 space-y-3 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your name"
            />
          </div>

          <div className="w-full md:w-40">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Rating (1–10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Your review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm outline-none focus:ring-2 focus:ring-yellow-400 resize-y"
            placeholder="What did you like or dislike about the movie?"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-500 transition-colors self-start"
        >
          Submit Review
        </button>
      </form>

      {/* Reviews list */}
      <div className="mt-5 space-y-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to review this movie.
          </p>
        ) : (
          reviews.map((r) => (
            <article
              key={r.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3"
            >
              <div className="flex justify-between items-center mb-1">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {r.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm font-semibold text-yellow-400">
                  ★ {r.rating}/10
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                {r.comment}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

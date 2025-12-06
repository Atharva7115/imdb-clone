import React from "react";

const skeletonItems = Array.from({ length: 8 });

export default function MovieSkeletonGrid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {skeletonItems.map((_, idx) => (
        <article
          key={idx}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
        >
          {/* Poster skeleton */}
          <div className="h-72 bg-gray-200 dark:bg-gray-700" />

          {/* Text skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

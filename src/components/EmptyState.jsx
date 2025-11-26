import React from "react";

export default function EmptyState({ message }) {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
      {message}
    </div>
  );
}

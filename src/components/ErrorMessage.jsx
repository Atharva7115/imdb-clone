import React from "react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center text-center py-10">
      <p className="text-red-500 font-medium mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}

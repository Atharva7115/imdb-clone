import React from "react";

export default function FilterBar({ filter, setFilter, clearCompleted }) {
  const btn = (name, label) => (
    <button
      onClick={() => setFilter(name)}
      className={`px-3 py-1 rounded ${filter === name ? "bg-yellow-500 text-black" : "text-gray-300"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex gap-2">
        {btn("all", "All")}
        {btn("pending", "Pending")}
        {btn("completed", "Completed")}
      </div>

      <div>
        <button onClick={clearCompleted} className="text-sm text-gray-400">Clear completed</button>
      </div>
    </div>
  );
}

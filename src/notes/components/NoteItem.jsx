import React from "react";

export default function NoteItem({ note, onDelete }) {
  return (
    <div className="flex items-start justify-between bg-gray-800 p-3 rounded-md">
      <div className="whitespace-pre-wrap">{note.text}</div>
      <button
        onClick={() => onDelete(note.id)}
        className="ml-4 text-red-400 hover:text-red-500"
        aria-label="Delete note"
      >
        ✕
      </button>
    </div>
  );
}


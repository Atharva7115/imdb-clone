import React, { useState, useRef } from "react";

export default function NoteInput({ addNote }) {
  const [text, setText] = useState("");
  const ref = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    addNote(t);
    setText("");
    ref.current?.focus();
  };

  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="flex gap-2">
        <input
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a quick note..."
          className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 outline-none"
          aria-label="Note text"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-yellow-400 text-black font-medium"
        >
          Save
        </button>
      </div>
    </form>
  );
}

import React, { useState, useRef } from "react";

export default function TodoInput({ add }) {
  const [text, setText] = useState("");
  const ref = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    add(t);
    setText("");
    ref.current?.focus();
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-4">
      <input
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded"
        placeholder="Add a new task..."
      />
      <button className="px-4 py-2 bg-yellow-500 text-black rounded">Add</button>
    </form>
  );
}

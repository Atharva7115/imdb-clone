import React from "react";

export default function TodoItem({ todo, toggle, del }) {
  return (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
      <div className="flex items-center gap-3">
        <input type="checkbox" className="w-5 h-5" checked={todo.completed} onChange={() => toggle(todo.id)} />
        <span className={todo.completed ? "line-through text-gray-400" : ""}>{todo.text}</span>
      </div>
      <button onClick={() => del(todo.id)} className="text-red-400">✕</button>
    </div>
  );
}

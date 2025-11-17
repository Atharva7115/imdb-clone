import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, toggle, del }) {
  if (!todos.length)
    return <div className="text-gray-400 py-6 text-center">No tasks — add one above.</div>;
  return <div className="space-y-3">{todos.map(t => <TodoItem key={t.id} todo={t} toggle={toggle} del={del} />)}</div>;
}

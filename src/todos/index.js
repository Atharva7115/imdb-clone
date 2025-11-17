// src/todos/index.js
import React, { useEffect, useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import FilterBar from "./components/FilterBar";

const STORAGE_KEY = "todos_v1";

export default function TodoApp() {
  // initialize synchronously from localStorage to avoid race/flash
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      console.log("INIT load raw:", raw);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to parse todos on init, clearing corrupted key:", err);
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  const [filter, setFilter] = useState("all");

  // persist to localStorage whenever todos change
  useEffect(() => {
    try {
      console.log("SAVING todos ->", todos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
      console.error("Failed to save todos:", err);
    }
  }, [todos]);

  // actions
  const add = (text) => {
    console.log("ADDING:", text);
    setTodos((s) => [{ id: Date.now(), text, completed: false }, ...s]);
  };

  const toggle = (id) =>
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const del = (id) => setTodos((s) => s.filter((t) => t.id !== id));

  const clearCompleted = () => setTodos((s) => s.filter((t) => !t.completed));

  const filtered = todos.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📝 To-Do</h2>

      <TodoInput add={add} />

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        clearCompleted={clearCompleted}
      />

      <TodoList todos={filtered} toggle={toggle} del={del} />
    </div>
  );
}

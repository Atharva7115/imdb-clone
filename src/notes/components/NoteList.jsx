import React from "react";
import NoteItem from "./NoteItem";

export default function NoteList({ notes = [], onDelete }) {
  if (!notes.length)
    return <div className="text-gray-400 text-center py-8">No notes yet — add one above.</div>;

  return (
    <div className="space-y-3">
      {notes.map((n) => (
        <NoteItem key={n.id} note={n} onDelete={onDelete} />
      ))}
    </div>
  );
}

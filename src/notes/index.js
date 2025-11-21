import React from "react";
import NoteInput from "./components/NoteInput";
import NoteList from "./components/NoteList";

export default function NotesApp() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center gap-4 mb-6">
          <img
            src="/mnt/data/b008d04c-3c26-4641-a8f2-b8c0081a7261.png"
            alt="logo"
            className="w-12 h-12 rounded-md object-cover"
          />
          <h1 className="text-2xl font-bold">Quick Notes</h1>
        </header>

        <Notes />
      </div>
    </div>
  );
}

/* Small wrapper component that contains the logic so child components stay dumb */
function Notes() {
  const STORAGE_KEY = "notes_v1";

  // initialize from localStorage synchronously (no flash)
  const [notes, setNotes] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to parse notes:", e);
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  // persist on change
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes:", e);
    }
  }, [notes]);

  const addNote = (text) => {
    const note = { id: Date.now().toString(36), text };
    setNotes((s) => [note, ...s]);
  };

  const deleteNote = (id) => setNotes((s) => s.filter((n) => n.id !== id));

  return (
    <>
      <NoteInput addNote={addNote} />
      <NoteList notes={notes} onDelete={deleteNote} />
    </>
  );
}

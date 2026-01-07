"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null); // Tracks which note is being edited

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      // UPDATE existing note
      await fetch(`/api/notes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setEditId(null);
    } else {
      // CREATE new note
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    setFormData({ title: "", content: "" });
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setFormData({ title: note.title, content: note.content });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
  };

  const deleteNote = async (id) => {
    if (confirm("Delete this note?")) {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      fetchNotes();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-600">My Notes</h1>
      </header>

      {/* Form Section */}
      <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase text-gray-400">
            {editId ? "Editing Note" : "New Note"}
          </h2>
          <input
            className="text-lg font-semibold outline-none border-b-2 border-gray-100 focus:border-blue-400 p-2 transition-colors"
            placeholder="Note Title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            className="outline-none p-2 h-24 resize-none text-gray-700"
            placeholder="Write your content here..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
          <div className="flex gap-2 self-end">
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setFormData({ title: "", content: "" }) }}
                className="text-gray-500 px-4"
              >
                Cancel
              </button>
            )}
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all">
              {editId ? "Update Note" : "Save Note"}
            </button>
          </div>
        </form>
      </section>

      {/* List Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div key={note._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{note.title}</h2>
              <p className="text-gray-600 mb-4">{note.content}</p>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-xs text-gray-400 italic">
                {new Date(note.createdAt).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(note)} className="text-blue-500 hover:underline text-sm">Edit</button>
                <button onClick={() => deleteNote(note._id)} className="text-red-500 hover:underline text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
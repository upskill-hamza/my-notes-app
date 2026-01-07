"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ title: "", content: "" });
    fetchNotes();
    setLoading(false);
  };

  const deleteNote = async (id) => {
    if (confirm("Delete this note?")) {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      fetchNotes();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-600">My Notes</h1>
        <p className="text-gray-500 mt-2">Capture your thoughts instantly</p>
      </header>

      {/* Input Form Section */}
      <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg self-end transition-all disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </form>
      </section>

      {/* Notes Grid Display */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.length === 0 && <p className="text-center col-span-full text-gray-400">No notes yet. Add one above!</p>}
        
        {notes.map((note) => (
          <div key={note._id} className="group bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{note.title}</h2>
            <p className="text-gray-600 whitespace-pre-wrap mb-4">{note.content}</p>
            
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xs text-gray-400 italic">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
              <button 
                onClick={() => deleteNote(note._id)}
                className="text-red-400 hover:text-red-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
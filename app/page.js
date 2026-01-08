"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `/api/notes/${editId}` : "/api/notes";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setFormData({ title: "", content: "" });
      setEditId(null);
      await fetchNotes();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setFormData({ title: note.title, content: note.content });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteNote = async (id) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      fetchNotes();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-green-600 to-orange-400 bg-clip-text text-transparent">
            Simple Notes App
          </h1>
          <span className="text-xl font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        {/* Editor Section */}
        <section className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-2 w-2 rounded-full ${editId ? 'bg-amber-400' : 'bg-green-400'}`}></div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {editId ? "Editing mode" : "Create new note"}
                </h2>
              </div>
              
              <input
                className="w-full text-xl font-bold placeholder:text-gray-500 outline-none border-none focus:ring-0"
                placeholder="Give it a title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                className="w-full min-h-[120px] text-gray-600 placeholder:text--300 outline-none border-none focus:ring-0 resize-none"
                placeholder="What's on your mind?"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                {editId && (
                  <button 
                    type="button" 
                    onClick={() => {setEditId(null); setFormData({title:"", content:""})}}
                    className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  disabled={isSubmitting}
                  className={`ml-auto px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 flex items-center gap-2
                    ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'}
                  `}
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {editId ? "Update Note" : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Notes Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="text-5xl mb-4">✍️</div>
              <h3 className="text-lg font-bold text-gray-400">No notes yet. Start writing!</h3>
            </div>
          ) : (
            notes.map((note) => (
              <div 
                key={note._id} 
                className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-1">{note.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-4">
                  {note.content}
                </p>
                
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                  <time className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {new Date(note.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </time>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(note)}
                      className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                      title="Edit Note"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button 
                      onClick={() => deleteNote(note._id)}
                      className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                      title="Delete Note"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
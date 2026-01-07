import mongoose, { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const Note = models.Note || model("Note", NoteSchema);
export default Note;
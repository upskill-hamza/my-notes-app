import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, content } = await req.json();
  await connectDB();
  const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
  return NextResponse.json(updatedNote);
}

export async function DELETE(req, { params }) {
  const { id } = params;
  await connectDB();
  await Note.findByIdAndDelete(id);
  return NextResponse.json({ message: "Note deleted" });
}
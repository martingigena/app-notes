const express = require("express");
const router = express.Router();

const Note = require("../models/Note");

//Display layout to create new note
router.get("/notes/add", (req, res) => {
  res.render("notes/new-note");
});

//Create a New Note
router.post("/notes/new-note", async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Please Write a Title" });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      description,
    });
  } else {
    const newNote = new Note({
      title,
      description,
    });
    await newNote.save();
    req.flash("success_msg", "Note added Successfully");
    res.redirect("/notes");
  }
});

//Layout to see all notes created
router.get("/notes", async (req, res) => {
  const notes = await Note.find().sort({ date: "desc" }).lean();
  res.render("notes/all-notes", { notes });
});

//Display form to edit an specific note
router.get("/notes/edit/:id", async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  res.render("notes/edit-note", { note });
});

//Edit the note
router.put("/notes/edit-note/:id", async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Note Update Successfully");
  res.redirect("/notes");
});

//Delete the note
router.delete("/notes/delete/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted  Successfully");
  res.redirect("/notes");
});

module.exports = router;

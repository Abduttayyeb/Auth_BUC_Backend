const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

class notesController {
    constructor() {
        this.getNotesRequestHandler = asyncHandler(this.getNotesRequestHandler.bind(this));
        this.createNotesRequestHandler = asyncHandler(this.createNotesRequestHandler.bind(this));
        this.updateNotesRequestHandler = asyncHandler(this.updateNotesRequestHandler.bind(this));
        this.deleteNotesRequestHandler = asyncHandler(this.deleteNotesRequestHandler.bind(this));
    }

    async getNotesRequestHandler(req, res) {
        const notes = await Note.find().lean();

        if (!notes?.length) {
            return res.status(400).json({ message: "No notes found" });
        }

        const notesWithUser = await Promise.all(
            notes.map(async (note) => {
                const user = await User.findById(note.user).lean().exec();
                return { ...note, username: user.username };
            })
        );
        res.json(notesWithUser);
    }

    async createNotesRequestHandler(req, res) {
        const { user, title, text } = req.body;

        if (!user || !title || !text) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const duplicate = await Note.findOne({ title }).lean().exec();
        if (duplicate) {
            return res.status(409).json({ message: "Duplicate note title" });
        }

        console.log("Creation Initiation");
        const noteObject = { user, title, text };
        const note = await Note.create(noteObject);
        if (note) {
            res.status(201).json({ message: "New note created" });
        } else {
            res.status(400).json({ message: "Invalid note data received" });
        }
    }

    async updateNotesRequestHandler(req, res) {
        const { id, user, title, text, completed } = req.body;

        if (!id || !user || !title || !text || typeof completed !== "boolean") {
            return res.status(400).json({ message: "All fields are required" });
        }

        const note = await Note.findById(id).exec();

        if (!note) {
            return res.status(400).json({ message: "Note not found" });
        }

        const duplicate = await Note.findOne({ title }).lean().exec();

        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: "Duplicate note title" });
        }

        note.user = user;
        note.title = title;
        note.text = text;
        note.completed = completed;

        const updatedNote = note.save();

        res.json(`'${updatedNote.title}' updated`);
    }

    async deleteNotesRequestHandler(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Note ID required" });
        }

        const note = await Note.findById(id).exec();

        if (!note) {
            return res.status(400).json({ message: "Note not found" });
        }

        const result = await note.deleteOne();

        res.json({ message: `Note '${result.title}' with ID ${result._id} deleted` });
    }
}

module.exports = new notesController();

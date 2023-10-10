const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

class notesController {
    constructor() {
        this.getNotesRequestHandler = asyncHandler(this.getNotesRequestHandler.bind(this));
        this.createNotesRequestHandler = asyncHandler(this.createNotesRequestHandler.bind(this));
        // this.updateNotesRequestHandler = asyncHandler(this.updateNotesRequestHandler.bind(this));
        // this.deleteNotesRequestHandler = asyncHandler(this.deleteNotesRequestHandler.bind(this));
    }

    async getNotesRequestHandler(req, res) {
        console.log("Controller ::getNotesRequestHandler");
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
        console.log("Controller ::createNotesRequestHandler");
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
}

module.exports = new notesController();

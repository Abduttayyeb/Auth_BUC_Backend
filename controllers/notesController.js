const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

class notesController {
    constructor() {
        this.getNotesRequestHandler = this.getNotesRequestHandler.bind(this);
    }

    async getNotesRequestHandler(req, res) {
        const notes = await Note.find().lean();

        if (!notes?.length) {
            return res.status(400).json({ message: "No notes found" });
        }

        
    }
}

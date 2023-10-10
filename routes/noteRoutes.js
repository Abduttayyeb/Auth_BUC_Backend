const express = require("express");
const notesController = require("../controllers/notesController");

const router = express.Router();

router.route("/")
        .get(notesController.getNotesRequestHandler)
        .post(notesController.createNotesRequestHandler)
        // .patch()
        // .delete();

module.exports = router;

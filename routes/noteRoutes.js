const express = require("express");
const notesController = require("../controllers/notesController");

const router = express.Router();

router.route("/")
        .get(notesController.getNotesRequestHandler)
        .post(notesController.createNotesRequestHandler)
        .patch(notesController.updateNotesRequestHandler)
        .delete(notesController.deleteNotesRequestHandler);

module.exports = router;

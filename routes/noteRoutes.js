const express = require("express");
const notesController = require("../controllers/notesController");
const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router();

router.use(verifyJWT)

router.route("/")
        .get(notesController.getNotesRequestHandler)
        .post(notesController.createNotesRequestHandler)
        .patch(notesController.updateNotesRequestHandler)
        .delete(notesController.deleteNotesRequestHandler);

module.exports = router;

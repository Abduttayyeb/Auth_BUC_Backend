const express = require("express");
const userController = require("../controllers/userController")

const router = express.Router();

router.route("/")
    .get(userController.getUsersRequestHandler)
    .post(userController.createUserRequestHandler)
    .patch(userController.updateUserRequestHandler)
    .delete(userController.deleteUserRequestHandler);

module.exports = router;

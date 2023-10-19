const express = require("express");
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.use(verifyJWT);

router
    .route("/")
    .get(userController.getUsersRequestHandler)
    .post(userController.createUserRequestHandler)
    .patch(userController.updateUserRequestHandler)
    .delete(userController.deleteUserRequestHandler);

module.exports = router;

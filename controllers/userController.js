const User = require("../models/User");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

class userController {
    constructor() {
        this.getUsersRequestHandler = asyncHandler(this.getUsersRequestHandler.bind(this));
        this.createUserRequestHandler = asyncHandler(this.createUserRequestHandler.bind(this));
        this.updateUserRequestHandler = asyncHandler(this.updateUserRequestHandler.bind(this));
        this.deleteUserRequestHandler = asyncHandler(this.deleteUserRequestHandler.bind(this));
    }

    async getUsersRequestHandler(req, res) {
        const users = await User.find().select("-password").lean();
        if (!users?.length) {
            return res.status(400).json({ message: "No users found" });
        }
        res.json(users);
    }

    async createUserRequestHandler(req, res) {
        const { username, password, roles } = req.body;

        if (!username || !password || !Array.isArray(roles) || !roles.length) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const duplicate = await User.findOne({ username }).lean().exec();
        if (duplicate) {
            return res.status(409).json({ message: "Duplicate username" });
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const userObject = { username, password: hashedPwd, roles };
        const user = await User.create(userObject);
        if (user) {
            res.status(201).json({ message: `New user ${username} created` });
        } else {
            res.status(400).json({ message: "Invalid user data received" });
        }
    }

    async updateUserRequestHandler(req, res) {
        const { id, username, roles, active, password } = req.body;

        if (
            !id ||
            !username ||
            !Array.isArray(roles) ||
            !roles.length ||
            typeof active !== "boolean"
        ) {
            return res.status(400).json({ message: "All field are required" });
        }

        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const duplicate = await User.findOne({ username }).lean().exec();

        // Allow updates to the original user
        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: "Duplicate username" });
        }

        // When you update a document using the Mongoose model instance and the dot operator, the data goes through
        // the same validation and middleware processes that occur during the creation of a new document.
        // This allows you to apply any pre-save validation or middleware functions that you've defined for the model.
        // This can be useful for ensuring data integrity and consistency.

        user.username = username;
        user.roles = roles;
        user.active = active;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await user.save();
        res.json({ message: `${updatedUser.username} updated` });
    }

    async deleteUserRequestHandler(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID Required" });
        }

        const note = await Note.findOne({ user: id }).lean().exec();
        if (note) {
            return res.status(400).json({ message: "User has assigned notes" });
        }

        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        await user.deleteOne();

        res.status(204).send();
    }
}

module.exports = new userController()


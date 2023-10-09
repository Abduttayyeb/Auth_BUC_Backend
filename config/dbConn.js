const mongoose = require("mongoose");
let connection;

const connectDB = async () => {
    try {
        connection = await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;

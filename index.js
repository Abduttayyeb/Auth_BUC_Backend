require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser"); // This middleware simplifies the process of handling cookies
const cors = require("cors");
const mongoose = require("mongoose");

const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");

const app = express();
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);
connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, `/public`)));
app.use("/", require("./routes/root"));
app.use("/auth",require("./routes/authRoutes"))
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));

app.use(errorHandler); // This error-handling middleware function is added at the end of the middleware function stack.

mongoose.connection.once("open", () => {
    console.log("Connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

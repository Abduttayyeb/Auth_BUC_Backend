const express = require("express");
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser"); // This middleware simplifies the process of handling cookies
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const app = express();
const PORT = process.env.PORT || 3500;

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, `/public`)));
app.use("/", require("./routes/root"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
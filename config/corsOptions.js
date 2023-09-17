const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
    origin: (origin, callback) => {
        // To not block REST tools or server-to-server requests, add a !origin check
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    // Configures the Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted.
    credentials: true,
    optionsSuccessStatus: 200,
};

module.exports = corsOptions;

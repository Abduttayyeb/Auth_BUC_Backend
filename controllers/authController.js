const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

class authController {
    constructor() {}

    async userLogin(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const foundUser = await User.findOne({ username }).exec();
        if (!foundUser || !foundUser.active) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const pwdMatch = await bcrypt.compare(password, foundUser.password);
        if (!pwdMatch) return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: foundUser.roles,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1m" }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        // The access token is returned to the client, while the refresh token is
        // securely stored on the server and sent to the client.

        res.cookie("jwt", refreshToken, {
            httpOnly: true, //accesible only by web server
            secure: true,
            sameSite: "None", //cross-site cookie
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // When the access token expires, the client can send the refresh token
        // to the server to obtain a new access token. This process is repeated
        // as long as the refresh token is valid, allowing the user to stay logged in.

        res.json({ accessToken });
    }

    async tokenRefresh(req, res) {
        const cookies = req.cookies;

        if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
        const refreshToken = cookies.jwt;

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            asyncHandler(async (err, decoded) => {
                if (err) return res.status(403).json({ message: "Forbidden" });

                const foundUser = await User.findOne({ username: decoded.username });
                if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            username: foundUser.username,
                            roles: foundUser.roles,
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "1m" }
                );

                res.json({ accessToken });
            })
        );
    }

    async userLogout(req, res) {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204);
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        res.json({ message: "Cookie Cleared" });
    }
}

module.exports = new authController();

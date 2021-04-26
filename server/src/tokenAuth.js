require("dotenv").config();

const jwt = require("jsonwebtoken");

exports.createAccessToken = user => {
    return jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN, {
        expiresIn: "15m",
    });
};

exports.createRefreshToken = user => {
    return jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN, {
        expiresIn: "7d",
    });
};

exports.sendRefreshToken = (res, token) => {
    res.cookie("jid", token, {
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
        // secure: true,
    });
};

exports.cookieOptions = {
    httpOnly: true,
    path: "/refresh-token",
};

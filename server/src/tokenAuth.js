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
        path: "/refresh-token",
        sameSite: "None",
        secure: true,
        // expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    });
};

exports.cookieOptions = {
    httpOnly: true,
    path: "/refresh-token",
};

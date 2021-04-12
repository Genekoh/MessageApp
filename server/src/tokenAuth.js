require("dotenv").config();

const jwt = require("jsonwebtoken");

exports.createAccessToken = (user) => {
    console.log(user);
    return jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN, {
        expiresIn: "15s",
    });
};

exports.createRefreshToken = (user) => {
    return jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN, {
        expiresIn: "7d",
    });
};

exports.sendRefreshToken = (res, token) => {
    res.cookie("jid", token, {
        httpOnly: true,
        path: "/refresh-token",
        // expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    });
};

require("dotenv").config();

const jwt = require("jsonwebtoken");
const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} = require("../tokenAuth.js");

exports.postRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.jid;
    if (!refreshToken)
        return res.status(401).send({ ok: false, accessToken: "" });

    let user;
    try {
        user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    } catch (err) {
        return res.status(403).send({ ok: false, accessToken: "" });
    }

    // TODO: Check if refresh token matches with refresh token stored in user in database

    return res.json({ ok: true, accessToken: createAccessToken(user) });
};

exports.postLogin = (req, res, next) => {
    const { username, password } = req.body;
    const user = { username };

    // TODO: Validate username and password with database

    sendRefreshToken(res, createRefreshToken(user));

    return res.json({
        ok: true,
        accessToken: createAccessToken(user),
    });
};

exports.deleteLogout = (req, res, next) => {};

require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} = require("../tokenAuth.js");
const User = require("../models/user.js");
const io = require("../io.js");

exports.postRefreshToken = async (req, res, next) => {
    try {
        const error = new Error();
        const refreshToken = req.cookies.jid;
        const username = req.body.username;
        if (!refreshToken || !username) {
            error.status = 401;
            throw error;
        }

        let user;
        user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN).catch(() => {
            error.status = 403;
            throw error;
        });

        // TODO: Check if refresh token matches with refresh token stored in user in database
        const existingRefreshToken = User.findOne({ where: { refreshToken } });

        return res.json({ ok: true, accessToken: createAccessToken(user) });
    } catch (error) {
        if (!error.status) {
            return res.status(500).json({ ok: false, accessToken: "" });
        }

        return res.status(error.status).json({ ok: false, accessToken: "" });
    }
};

exports.postLogin = async (req, res, next) => {
    try {
        const error = new Error();

        const { username, password } = req.body;

        const user = await User.findOne({ where: { userName: username } });
        if (!user) {
            error.status = 400;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            error.status = 403;
            throw error;
        }
        const refreshToken = createRefreshToken({ username });
        user.refreshToken = refreshToken;
        await user.save();

        sendRefreshToken(res, refreshToken);

        return res.json({
            ok: true,
            accessToken: createAccessToken({ username }),
        });
    } catch (error) {
        if (!error.status) {
            return res.status(500).json({ ok: false, accessToken: "" });
        }

        return res.status(error.status).json({ ok: false, accessToken: "" });
    }
};

exports.postSignup = async (req, res, next) => {
    try {
        const error = new Error();
        const { username, password, email } = req.body;
        const existingUser = await User.findOne({
            where: { userName: username },
        });
        if (existingUser) {
            error.status = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            process.env.PASSWORD_SALT,
        );
        const refreshToken = createRefreshToken({ username });

        User.create({
            userName: username,
            password: hashedPassword,
            email,
            pathToProfilePic: null,
            refreshToken,
        });

        sendRefreshToken(res, refreshToken);

        return res.json({
            ok: true,
            accessToken: createAccessToken({ username }),
        });
    } catch (error) {
        if (!error.status) {
            return res.status(500).json({ ok: false, accessToken: "" });
        }

        return res.status(error.status).json({ ok: false, accessToken: "" });
    }
};

exports.deleteLogout = (req, res, next) => {};

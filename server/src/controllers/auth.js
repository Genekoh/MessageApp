require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} = require("../tokenAuth.js");
const IO = require("../socket.js");
const throwError = require("../util/throwError.js");

const User = require("../models/user.js");
const Channel = require("../models/channel.js");
const ChannelMember = require("../models/channelMember.js");

exports.getRefreshToken = async (req, res) => {
    try {
        const error = new Error();
        const refreshToken = req.cookies.jid;
        if (!refreshToken) {
            throwError(error, 401);
        }

        let user;
        try {
            user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        } catch (e) {
            throwError(error, 403);
        }
        const username = user.username;
        if (!username) {
            throwError(err, 403);
        }

        const userInfo = await User.findOne({
            where: { userName: username },
        });
        if (refreshToken !== userInfo.refreshToken) {
            throwError(error, 403);
        }

        return res
            .status(200)
            .json({ ok: true, accessToken: createAccessToken(user) });
    } catch (error) {
        if (!error.status) {
            return res.status(500).json({ ok: false, accessToken: "" });
        }

        return res.status(error.status).json({ ok: false, accessToken: "" });
    }
};

exports.postLogin = async (req, res) => {
    try {
        const error = new Error();

        const { username, password } = req.body;

        if (!username || !password) {
            throwError(error, 400);
        }

        const user = await User.findOne({ where: { userName: username } });
        if (!user) {
            throwError(error, 400);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throwError(error, 403);
        }
        const refreshToken = createRefreshToken({ username });
        user.refreshToken = refreshToken;
        await user.save();

        const chan = await ChannelMember.findAll({
            where: { UserId: user.id },
        });

        IO.getIO().on("connection", socket => {
            chan.forEach(chanMember => {
                console.log("client joining channel");
                socket.join(chanMember.ChannelId.toString());
            });
        });

        sendRefreshToken(res, refreshToken);

        return res.status(200).json({
            ok: true,
            accessToken: createAccessToken({ username }),
        });
    } catch (error) {
        console.log(error);
        if (!error.status) {
            return res.status(500).json({ ok: false, accessToken: "" });
        }

        return res.status(error.status).json({ ok: false, accessToken: "" });
    }
};

exports.postSignup = async (req, res) => {
    try {
        const error = new Error();
        const { username, password, email } = req.body;
        const existingUser = await User.findOne({
            where: { userName: username },
        });
        if (existingUser) {
            throwError(error, 409);
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

        return res.status(201).json({
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

exports.deleteLogout = (req, res) => {};

require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} = require("../tokenAuth.js");
const { getIO } = require("../socket.js");
const { throwError, getUser } = require("../util");

const User = require("../models/user.js");
const ChannelMember = require("../models/channelMember.js");

exports.getRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.jid;
        if (!refreshToken) {
            throwError(401, "unable to find refresh token in cookies");
        }

        let user;
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (e, u) => {
            if (e) return throwError(403, "invalid refresh token");
            user = u;
        });

        const username = user.username;
        if (!username) {
            throwError(403, "invalid authorization header");
        }

        const userInfo = await User.findOne({
            where: { userName: username },
        });
        console.log(refreshToken === userInfo.refreshToken);
        if (refreshToken !== userInfo.refreshToken) {
            console.log("hi");
            throwError(403, "invalid refresh token");
        }

        const chan = await ChannelMember.findAll({
            where: { UserId: userInfo.id },
        });

        getIO().once("connection", socket => {
            chan.forEach(chanMember => {
                console.log("client joining channel");
                socket.join(chanMember.ChannelId.toString());
            });
        });

        return res.status(200).json({
            ok: true,
            username,
            id: userInfo.id,
            accessToken: createAccessToken(user),
            errorMessage: "",
        });
    } catch (error) {
        console.log(error.message);
        if (!error.status) {
            return res.status(500).json({
                ok: false,
                accessToken: "",
                errorMessage: error.message,
            });
        }

        return res
            .status(error.status)
            .json({ ok: false, accessToken: "", errorMessage: error.message });
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throwError(400, "invalid request body");
        }

        const user = await getUser({ userName: username });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throwError(403, "invalid password");
        }
        const refreshToken = createRefreshToken({ username });
        user.refreshToken = refreshToken;
        await user.save();

        const chan = await ChannelMember.findAll({
            where: { UserId: user.id },
        });

        getIO().once("connection", socket => {
            chan.forEach(chanMember => {
                console.log("client joining channel");
                socket.join(chanMember.ChannelId.toString());
            });
        });

        sendRefreshToken(res, refreshToken);

        return res.status(200).json({
            ok: true,
            username,
            id: user.id,
            accessToken: createAccessToken({ username }),
            errorMessage: "",
        });
    } catch (error) {
        console.log(error.message);
        if (!error.status) {
            return res.status(500).json({
                ok: false,
                accessToken: "",
                errorMessage: error.message,
            });
        }

        return res
            .status(error.status)
            .json({ ok: false, accessToken: "", errorMessage: error.message });
    }
};

exports.postSignup = async (req, res) => {
    try {
        const { username, password, pathToProfilePic } = req.body;

        const existingUser = await User.findOne({
            where: { userName: username },
        });
        if (existingUser) {
            throwError(409, "existing user");
        }

        const hashedPassword = await bcrypt.hash(
            password,
            process.env.PASSWORD_SALT,
        );
        const refreshToken = createRefreshToken({ username });

        await User.create({
            userName: username,
            password: hashedPassword,
            pathToProfilePic: pathToProfilePic
                ? pathToProfilePic
                : "default.png",
            refreshToken,
        });

        sendRefreshToken(res, refreshToken);

        return res.status(201).json({
            ok: true,
            accessToken: createAccessToken({ username }),
            errorMessage: "",
        });
    } catch (error) {
        console.log(error);
        if (!error.status) {
            return res.status(500).json({
                ok: false,
                accessToken: "",
                errorMessage: error.message,
            });
        }

        return res
            .status(error.status)
            .json({ ok: false, accessToken: "", errorMessage: error.message });
    }
};

exports.deleteLogout = async (req, res) => {
    try {
        const { username } = req.user;

        const user = await getUser({ userName: username });
        user.refreshToken = null;
        await user.save();

        const chan = await ChannelMember.findAll({
            where: { UserId: user.id },
        });

        getIO().once("connection", socket => {
            chan.forEach(chanMember => {
                console.log("client leaving channel");
                socket.leave(chanMember.ChannelId.toString());
            });
        });

        return res.status(200).json({ ok: true, errorMessage: "" });
    } catch (error) {
        console.log(error.message);
        if (!error.status) {
            return res
                .status(500)
                .json({ ok: false, errorMessage: error.message });
        }

        return res
            .status(error.status)
            .json({ ok: false, errorMessage: error.message });
    }
};

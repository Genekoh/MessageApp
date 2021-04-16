require("dotenv").config();

const express = require("express");

const authController = require("./controllers/auth.js");
const userController = require("./controllers/user.js");
const channelController = require("./controllers/channel.js");
const isAuth = require("./middlewares/isAuth.js");

const router = express.Router();

// Routes

router.post("/refresh-token", authController.postRefreshToken);

router.post("/login", authController.postLogin);

router.get("/user-info/:username", isAuth, userController.getUserInfo);

router.get("/messages", isAuth, userController.getMessages);

router.get(
    "/messages/:channelId",
    isAuth,
    channelController.getMessagesFromChannel,
);

router.post("/create-channel", isAuth, channelController.postCreateChannel);

router.post("/message", isAuth, channelController.postMessage);

module.exports = router;

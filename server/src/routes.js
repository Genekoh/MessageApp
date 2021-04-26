require("dotenv").config();

const express = require("express");

const authController = require("./controllers/auth.js");
const userController = require("./controllers/user.js");
const channelController = require("./controllers/channel.js");
const isAuth = require("./middlewares/isAuth.js");

const router = express.Router();

// Routes

// Unprotected Routes
router.get("/refresh-token", authController.getRefreshToken);

router.post("/login", authController.postLogin);

// Protected Routes
router.get("/user-info", isAuth, userController.getUserInfo);

router.get(
    "/messages/:channelId",
    isAuth,
    channelController.getMessagesFromChannel,
);

router.post("/create-channel", isAuth, channelController.postCreateChannel);

router.post("/message", isAuth, channelController.postMessage);

module.exports = router;

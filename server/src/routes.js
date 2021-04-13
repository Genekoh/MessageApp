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

router.get("/user-info/:username", userController.getUserInfo); // TODO add isAuth middleware

router.get("/:channelId/messages", channelController.getMessages); // TODO add isAuth middleware

module.exports = router;

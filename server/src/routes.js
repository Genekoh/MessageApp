require("dotenv").config();

const path = require("path");
const express = require("express");
const multer = require("multer");

const authController = require("./controllers/auth.js");
const userController = require("./controllers/user.js");
const channelController = require("./controllers/channel.js");
const isAuth = require("./middlewares/isAuth.js");

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, "./profilepic");
    },
    filename(req, _file, cb) {
        cb(null, req.user.username);
    },
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 100 } });

const router = express.Router();

// ROUTES

// Unprotected Routes
router.get("/refresh-token", authController.getRefreshToken);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.use("/static", express.static(path.join(__dirname, "..", "public")));

// Protected Routes
router.delete("/logout", isAuth, authController.deleteLogout);

router.get("/user-info", isAuth, userController.getUserInfo);

router.get("/friend-list", isAuth, userController.getFriendList);

router.post(
    "/profile-pic",
    isAuth,
    upload.single("profilePic"),
    userController.postProfilePic,
);

router.post("/add-friend", isAuth, userController.postAddFriend);

router.get(
    "/messages/:channelId",
    isAuth,
    channelController.getMessagesFromChannel,
);

router.post("/create-channel", isAuth, channelController.postCreateChannel);

router.post("/message", isAuth, channelController.postMessage);

module.exports = router;

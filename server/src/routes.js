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
        cb(null, path.join(__dirname, "..", "public"));
    },
    filename(req, _file, cb) {
        cb(null, req.user.username + ".png");
    },
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 100 } });

const router = express.Router();

// ROUTES

// Unprotected Routes
router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.get("/refresh-token", authController.getRefreshToken);

router.use("/static", express.static(path.join(__dirname, "..", "public")));

// Protected Routes
router.delete("/logout", isAuth, authController.deleteLogout);

router.get("/user-info", isAuth, userController.getUserInfo);

router.get("/friend-list", isAuth, userController.getFriendList);

router.post(
    "/profile-pic/:id",
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

router.post("/create-dm", isAuth, channelController.postCreateDm);

router.post(
    "/add-channel-member",
    isAuth,
    channelController.postAddUserToChannel,
);

router.delete(
    "/channel-member-leave",
    isAuth,
    channelController.deleteUserLeaveChannel,
);

router.post("/message", isAuth, channelController.postMessage);

module.exports = router;

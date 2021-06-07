const {
    throwError,
    userIsInChannel,
    getChannelMessages,
    getUser,
    usersAreFriends,
} = require("../util");
const IO = require("../socket.js");

const User = require("../models/user.js");
const Channel = require("../models/channel.js");
const Message = require("../models/message.js");

exports.getMessagesFromChannel = async (req, res) => {
    try {
        const username = req.user.username;
        const channelId = req.params.channelId;

        const isAuthorized = await userIsInChannel(username, channelId);
        if (!isAuthorized) {
            throwError(401, "user not authorized");
        }

        const messages = await getChannelMessages({ ChannelId: channelId });
        console.log("hi");
        console.log(messages);

        return res.status(200).json({ ok: true, messages, errorMessage: "" });
    } catch (error) {
        console.log(error.message);
        if (!error.status) {
            return res
                .status(500)
                .json({ ok: false, messages: [], errorMessage: error.message });
        }

        return res
            .status(error.status)
            .json({ ok: false, messages: [], errorMessage: error.message });
    }
};

exports.postMessage = async (req, res) => {
    try {
        const username = req.user.username;
        const { channelId, text } = req.body;

        const isAuthorized = await userIsInChannel(username, channelId);
        if (!isAuthorized) {
            throwError(401, "user is not authorized");
        }

        console.log();

        const message = await Message.create({ text });
        const channel = await Channel.findOne({ where: { id: channelId } });
        const user = await User.findOne({ where: { userName: username } });

        if (!channel) {
            throwError(400, "unable to find channel");
        }
        if (!user) {
            throwError(401, "unable to find user");
        }

        await channel.addMessage(message);
        await user.addMessage(message);

        const updatedMessage = await Message.findOne({
            where: { id: message.id },
            include: User,
        });
        console.log(updatedMessage.User.id);

        IO.getIO()
            .to(channelId.toString())
            .emit("new-message", {
                channelId,
                message: updatedMessage,
            });

        return res.status(200).json({ ok: true, message, errorMessage: "" });
    } catch (error) {
        console.log(error.message);
        if (!error.status) {
            return res
                .status(500)
                .json({ ok: false, message: {}, errorMessage: error.message });
        }

        return res
            .status(error.status)
            .json({ ok: false, message: {}, errorMessage: error.message });
    }
};

exports.postCreateChannel = async (req, res) => {
    try {
        const { name, type, members: memberUsernames } = req.body;
        const { username } = req.user;

        const members = await Promise.all(
            memberUsernames.map(async memberUsername => {
                const memberInfo = await getUser({ userName: memberUsername });
                const memberAreFriend = await usersAreFriends(
                    username,
                    memberUsername,
                );
                if (!memberAreFriend && memberUsername !== username) {
                    throwError(401, "user aren't friends");
                }
                return memberInfo;
            }),
        );
        if (members.length === 0 || members.length !== memberUsernames.length) {
            throwError(400, "invalid username");
        }

        let channel;
        channel = await Channel.create({
            name,
            type,
            memberCount: members.length,
        });
        if (!channel) {
            throwError(400, "unable to create channel");
        }

        await Promise.all(
            members.map(async member => {
                const role =
                    member.userName === req.user.username ? "admin" : "member";
                await member.addChannel(channel, {
                    through: { role },
                });
            }),
        );

        return res.status(201).json({ ok: true, errorMessage: "" });
    } catch (error) {
        console.log(error.message);
        if (!error || !error.status) {
            return res
                .status(500)
                .json({ ok: false, errorMessage: error.message });
        }

        return res
            .status(error.status)
            .json({ ok: false, errorMessage: error.message });
    }
};

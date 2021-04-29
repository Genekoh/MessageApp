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
const ChannelMember = require("../models/channelMember.js");
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

        return res.status(200).json({ ok: true, messages });
    } catch (error) {
        if (!error.status) {
            return res.status(500).json({ ok: false, messages: [] });
        }

        return res.status(error.status).json({ ok: false, messages: [] });
    }
};

exports.postMessage = async (req, res) => {
    try {
        const username = req.user.username;
        const channelId = req.body.channelId;
        console.log(req.body);
        const text = req.body.text;

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

        IO.getIO()
            .to(channelId.toString())
            .emit("new-message");

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.log(error);
        if (!error.status) {
            return res.status(500).json({ ok: false });
        }

        return res.status(error.status).json({ ok: false });
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

        return res.status(201).json({ ok: true });
    } catch (error) {
        console.log(error);
        if (!error || !error.status) {
            return res.status(500).json({ ok: false });
        }

        return res.status(error.status).json({ ok: false });
    }
};

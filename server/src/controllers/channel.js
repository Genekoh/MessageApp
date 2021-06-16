const {
    throwError,
    userIsInChannel,
    getChannelMessages,
    getUser,
    usersAreFriends,
    handleError,
    getAllUsers,
} = require("../util");

const User = require("../models/user.js");
const Channel = require("../models/channel.js");
const Message = require("../models/message.js");
const ChannelMember = require("../models/channelMember");
const { getIO, getSockets } = require("../socket.js");

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
        handleError(res, error);
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

        getIO()
            .to(channelId.toString())
            .emit("new-message", {
                channelId,
                message: updatedMessage,
            });

        return res.status(200).json({ ok: true, message, errorMessage: "" });
    } catch (error) {
        handleError(res, error);
    }
};

exports.postCreateChannel = async (req, res) => {
    try {
        const { name, type, members: memberUsernames, socketId } = req.body;
        const { username } = req.user;

        const members = await Promise.all(
            memberUsernames.map(async memberUsername => {
                const memberInfo = await getUser({
                    where: { userName: memberUsername },
                });
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

        return res.status(201).json({ ok: true, errorMessage: "", channel });
    } catch (error) {
        handleError(res, error);
    }
};

exports.postCreateDm = async (req, res) => {
    try {
        const { friendUsername, socketId } = req.body;
        const { username } = req.user;

        const userAreFriends = await usersAreFriends(username, friendUsername);
        if (!userAreFriends) {
            throwError(401, "user aren't friends");
        }

        const users = await getAllUsers({
            where: { userName: [username, friendUsername] },
        });
        if (users.length === 0 || users.length !== 2) {
            throwError(400, "invalid username");
        }
        if (users.length !== 2) {
            throwError(400, "invalid member count for dm");
        }

        let channel;
        channel = await Channel.create({
            type: "dm",
            memberCount: 2,
        });
        if (!channel) {
            throwError(400, "unable to create channel");
        }

        await Promise.all(
            users.map(async user => {
                const role =
                    user.userName === req.user.username ? "admin" : "member";
                await user.addChannel(channel, {
                    through: { role },
                });
            }),
        );

        getSockets()[socketId].join(channel.id);

        return res.status(201).json({ ok: true, errorMessage: "", channel });
    } catch (error) {
        handleError(res, error);
    }
};

exports.postAddUserToChannel = async (req, res) => {
    try {
        const { channelId, friendUsername } = req.body;
        const { username } = req.user;

        if (!channelId || !friendUsername) {
            throwError(400, "invalid request body");
        }

        const channel = await Channel.findByPk(channelId).catch(e => {
            console.log();
            throwError(401, "invalid search for channel");
        });
        if (!channel) {
            throwError(401, "channel not found");
        }
        const friend = await getUser({
            where: { userName: friendUsername },
        }).catch(() => {
            throwError(401, "invalid search for friend user");
        });
        if (!friend) {
            throwError(401, "friend not found");
        }
        const cm = await ChannelMember.findOne({
            where: { UserId: friend.id, ChannelId: channelId },
        });
        if (cm) {
            throwError(409, "friend is already in channel");
        }

        const memberAreFriends = await usersAreFriends(
            username,
            friend.userName,
        );
        if (!memberAreFriends) {
            throwError(401, "user are not friends");
        }

        channel.memberCount++;
        await channel.save();

        await ChannelMember.create({
            UserId: friend.id,
            ChannelId: channel.id,
            role: "member",
        });

        return res.status(201).json({ ok: true, errorMessage: "", channel });
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteUserLeaveChannel = async (req, res) => {
    try {
        const { channelId, userId } = req.body;

        if (!channelId || !userId) {
            throwError(400, "invalid request body");
        }

        const channel = await Channel.findByPk(channelId).catch(e => {
            console.log();
            throwError(401, "invalid search for channel");
        });
        if (!channel) {
            throwError(401, "channel not found");
        }
        const member = await ChannelMember.findOne({
            where: { UserId: userId, ChannelId: channelId },
        });
        if (!member) {
            throwError(409, "user is not in channel");
        }

        channel.memberCount--;
        await Promise.all([member.destroy(), channel.save()]);

        return res.status(201).json({ ok: true, errorMessage: "", channel });
    } catch (error) {
        handleError(res, error);
    }
};

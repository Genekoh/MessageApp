const User = require("../models/user.js");
const Channel = require("../models/channel.js");
const ChannelMember = require("../models/channelMember.js");
const Message = require("../models/message.js");
const Friend = require("../models/friend.js");

const throwError = (status, message = "") => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

const handleError = (res, error) => {
    console.log(error);
    if (!error.status) {
        return res.status(500).json({
            ok: false,
            channels: null,
            errorMessage: error.message,
        });
    }

    return res
        .status(error.status)
        .json({ ok: false, errorMessage: error.message });
};

const getUser = async query => {
    const user = await User.findOne(query);
    if (!user) {
        throwError(400, "unable to find user");
    }
    return user;
};

const getAllUsers = async query => {
    try {
        const users = await User.findAll(query);

        return users;
    } catch (error) {
        throwError(400, "error finding users");
    }
};

const usersAreFriends = async (username, friendUsername) => {
    const users = await User.findAll({
        where: { userName: [username, friendUsername] },
    });

    const [user, friend] = users;

    const isFriend = await Friend.findOne({
        where: { UserId: user.id, FriendUserId: friend.id },
    });

    if (!isFriend) {
        return false;
    }

    return true;
};

const getFriends = async query => {
    const friendData = await Friend.findAll(query);

    return friendData;
};

const userIsInChannel = async (username, channelId) => {
    const user = await User.findOne({ where: { userName: username } });
    const member = await ChannelMember.findOne({
        where: { ChannelId: channelId, UserId: user.id },
    });

    if (!member) {
        return false;
    }

    return true;
};

const getUserChannelsById = async id => {
    const cm = await ChannelMember.findAll({
        where: { UserId: id },
    });
    const channelIds = cm.map(c => c.ChannelId);

    const userChannels = await Channel.findAll({ where: { id: channelIds } });
    return userChannels;
};

const getChannelMembers = async query => {
    const channelMembers = await ChannelMember.findAll(query);
    const formattedChannelMembers = channelMembers.map(c => {
        c["username"] = c["User.userName"];
        delete c["User.userName"];
        return c;
    });
    return formattedChannelMembers;
};

const getChannelMessages = async condition => {
    const messages = await Message.findAll({ where: condition });

    return messages;
};

const getAllUserMessages = async userId => {
    const userChannels = await getUserChannelsById(userId);

    const messages = {};
    await Promise.all(
        userChannels.map(async chan => {
            const m = await Message.findAll({
                where: { ChannelId: chan.id },
                include: User,
            });

            // messages = [...messages, ...m];
            messages[chan.id] = m;
        }),
    );

    return messages;
};

module.exports = {
    throwError,
    handleError,
    getUser,
    getAllUsers,
    usersAreFriends,
    getFriends,
    userIsInChannel,
    getUserChannelsById,
    getChannelMembers,
    getChannelMessages,
    getAllUserMessages,
};

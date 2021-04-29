const User = require("../models/user.js");
const Channel = require("../models/channel.js");
const ChannelMember = require("../models/channelMember.js");
const Message = require("../models/message.js");
const Friend = require("../models/friend.js");

exports.throwError = (status, message = "") => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

exports.userIsInChannel = async (username, channelId) => {
    const user = await User.findOne({ where: { userName: username } });
    console.log(user.id, channelId);
    const member = await ChannelMember.findOne({
        where: { ChannelId: channelId, UserId: user.id },
    });

    if (!member) {
        return false;
    }

    return true;
};

exports.getUser = async condition => {
    const user = await User.findOne({ where: condition });
    if (!user) {
        throwError(400, "unable to find user");
    }
    return user;
};

exports.getUserChannels = async id => {
    const cm = await ChannelMember.findAll({
        where: { UserId: id },
    });

    const channelIds = cm.map(c => c.ChannelId);
    const userChannels = await Channel.findAll({ where: { id: channelIds } });
    return userChannels;
};

exports.getChannelMessages = async condition => {
    const messages = await Message.findAll({
        where: condition,
    });

    return messages;
};

exports.usersAreFriends = async (username, friendUsername) => {
    const users = await User.findAll({
        where: { userName: [username, friendUsername] },
    });
    if (!users || users.length !== 2) {
        return false;
    }

    const [user, friend] = users;

    const isFriend = await Friend.findOne({
        where: { UserId: user.id, FriendUserId: friend.id },
    });

    if (!isFriend) {
        return false;
    }

    return true;
};
const throwError = require("../util/throwError.js");

const User = require("../models/user.js");
const Channel = require("../models/channel.js");
const ChannelMember = require("../models/channelMember.js");
const Message = require("../models/message.js");

const userIsInChannel = async (username, channelId) => {
    const members = await ChannelMember.findAll({
        where: { ChannelId: channelId },
    });

    const memberInfo = await Promise.all(
        members.map(async member => {
            const user = await User.findOne({
                where: { id: member.UserId },
            });
            return user;
        }),
    );

    return memberInfo.some(member => member.userName === username);
};

exports.getMessages = async (req, res) => {
    try {
        const error = new Error();
        const username = req.user.username;
        const channelId = req.params.channelId;

        const isAuthorized = userIsInChannel(username, channelId);
        if (!isAuthorized) {
            throwError(error, 401);
        }

        const messages = await Message.findAll({
            where: { ChannelId: channelId },
        });

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
        const error = new Error();
        const username = req.user.username;
        const channelId = req.body.channelId;
        console.log(req.body);
        const text = req.body.text;

        const isAuthorized = await userIsInChannel(username, channelId);
        if (!isAuthorized) {
            throwError(error, 401);
        }

        console.log();
        const message = await Message.create({ text });
        const channel = await Channel.findOne({ where: { id: channelId } });
        const user = await User.findOne({ where: { userName: username } });

        if (!channel) {
            throwError(error, 400);
        }
        if (!user) {
            throwError(error, 401);
        }

        await channel.addMessage(message);
        await user.addMessage(message);

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.log(error);
        if (!error.status) {
            return res.status(500).json({ ok: false });
        }

        return res.status(error.status).json({ ok: true });
    }
};

const Channel = require("../models/channel.js");
const ChannelMember = require("../models/channelMember.js");
const Message = require("../models/message.js");
const User = require("../models/user.js");
const throwError = require("../util/throwError.js");

const getUser = async condition => {
    const user = await User.findOne({ where: condition });
    if (!user) {
        throwError(error, 400);
    }
    return user;
};

const getUserChannels = async id => {
    const cm = await ChannelMember.findAll({
        where: { UserId: id },
    });

    const channelIds = cm.map(c => c.ChannelId);
    console.log(channelIds);
    const userChannels = await Channel.findAll({ where: { id: channelIds } });
    return userChannels;
};

const getAllUserMessages = async userChannels => {
    const messages = {};
    await Promise.all(
        userChannels.map(async chan => {
            const m = await Message.findAll({
                where: { ChannelId: chan.id },
            });

            // messages = [...messages, ...m];
            messages[chan.id] = m;
        }),
    );

    return messages;
};

const getChannelMembers = async chanId => {
    const channelMembers = await ChannelMember.findAll({
        where: { ChannelId: chanId },
        attributes: ["UserId"],
        raw: true,
    });
    return channelMembers;
};

exports.getUserInfo = async (req, res) => {
    try {
        const error = new Error();
        const { username } = req.user;

        const user = await getUser({ userName: username });
        const userChannels = await getUserChannels(user.id);

        const messages = await getAllUserMessages(userChannels);

        const channels = [];
        await Promise.all(
            userChannels.map(async channel => {
                const channelMembers = await getChannelMembers(channel.id);
                const channelMemberIds = channelMembers.map(c => c.UserId);

                const users = await User.findAll({
                    where: { id: channelMemberIds },
                    attributes: ["userName"],
                    raw: true,
                });
                const usernames = users.map(u => u.userName);

                const name = channel.name ? channel.name : usernames.join(", ");
                const msg = messages[channel.id];
                channels.push({
                    channelId: channel.id,
                    type: channel.type,
                    name,
                    messages: msg,
                });
            }),
        );

        return res.status(200).json({ ok: true, channels });
    } catch (error) {
        console.log(error);
        if (!error.status) {
            return res.status(500).json({ ok: false, channels: null });
        }

        return res.status(error.status).json({ ok: false, channels: null });
    }
};

/*
channels
*/

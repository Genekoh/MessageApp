const ChannelMember = require("../models/channelMember.js");
const Message = require("../models/message.js");
const User = require("../models/user.js");
const throwError = require("../util/throwError.js");

exports.getUserInfo = async (req, res) => {
    try {
        const error = new Error();
        const { username } = req.user;

        const user = await User.findOne({ where: { userName: username } });
        if (!user) {
            throwError(error, 400);
        }

        const userChannels = await ChannelMember.findAll({
            where: { UserId: user.id },
        });

        let messages = [];
        await Promise.all(
            userChannels.map(async chan => {
                const m = await Message.findAll({
                    where: { ChannelId: chan.ChannelId },
                });

                // messages = [...messages, ...m];
                messages = messages.concat(m);
            }),
        );

        const channels = {};

        await Promise.all(
            userChannels.map(async chan => {
                const channelMembers = await ChannelMember.findAll({
                    where: { ChannelId: chan.ChannelId },
                    attributes: ["UserId"],
                    raw: true,
                });
                const channelMemberIds = channelMembers.map(c => c.UserId);

                const users = await User.findAll({
                    where: { id: channelMemberIds },
                    attributes: ["userName"],
                    raw: true,
                });
                const usernames = users.map(u => u.userName);

                const name = chan.name ? chan.name : usernames.join(", ");
                const msg = messages.filter(m => {
                    return m.ChannelId === chan.ChannelId;
                });
                channels[name] = msg;
            }),
        );

        // const user = {};

        return res.status(200).json({ ok: true, messages: channels });
    } catch (error) {
        console.log(error);
        if (!error.status) {
            return res.status(500).json({ ok: false, messages: {} });
        }

        return res.status(error.status).json({ ok: false, messages: {} });
    }
};

/*
channels
*/

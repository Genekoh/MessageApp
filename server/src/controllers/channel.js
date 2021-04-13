const User = require("../models/user.js");
const Channel = require("../models/channel.js");
const ChannelMember = require("../models/channelMember.js");
const Message = require("../models/message.js");

exports.getMessages = async (req, res) => {
    try {
        const error = new Error();
        const username = req.user.username;
        const channelId = req.params.channelId;

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

        if (!memberInfo.some(member => member.userName === username)) {
            error.status = 401;
            throw error;
        }

        const messages = await Message.findAll({
            where: { ChannelId: channelId },
        });

        return res.json({ ok: true, messages });
    } catch (error) {
        if (!error.status) {
            return res.status(500).json({ ok: false, messages: [] });
        }

        return res.status(error.status).json({ ok: false, messages: [] });
    }
};

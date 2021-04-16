const ChannelMember = require("../models/channelMember.js");
const Message = require("../models/message.js");
const User = require("../models/user.js");
const throwError = require("../util/throwError.js");

exports.getUserInfo = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ where: { userName: username } });
    } catch (error) {}
};

exports.getMessages = async (req, res) => {
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

        const formattedOutput = {};
        userChannels.forEach(chan => {
            const msg = messages.filter(m => {
                return m.ChannelId === chan.ChannelId;
            });
            formattedOutput[chan.ChannelId] = msg;
        });

        return res.status(200).json({ ok: true, messages: formattedOutput });
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

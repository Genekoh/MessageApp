const Friend = require("../models/friend.js");
const User = require("../models/user.js");
const {
    throwError,
    getUser,
    getUserChannels,
    getAllUserMessages,
    getChannelMembers,
} = require("../util");

exports.getUserInfo = async (req, res) => {
    try {
        const { username } = req.user;

        const user = await getUser({ userName: username });
        const userChannels = await getUserChannels(user.id);

        const messages = await getAllUserMessages(userChannels);

        const channels = {};
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
                channels[channel.id] = {
                    channelId: channel.id,
                    members: channelMembers,
                    type: channel.type,
                    name,
                    messages: msg,
                };
            }),
        );

        return res.status(200).json({ ok: true, channels });
    } catch (error) {
        if (!error.status) {
            return res.status(500).json({ ok: false, channels: null });
        }

        return res.status(error.status).json({ ok: false, channels: null });
    }
};

exports.getFriendList = async (req, res) => {
    try {
        const { username } = req.user;

        const user = await getUser({ userName: username });

        console.log("bruh", user.id);
        const friendData = await Friend.findAll({
            where: { UserId: user.id },
            include: { model: User, as: "FriendUser" },
        });

        const friendList = friendData.map(f => f.FriendUser);

        return res.status(200).json({ ok: true, friendList });
    } catch (error) {}
};

exports.postProfilePic = async (req, res) => {
    const { username } = req.user;

    const user = await getUser({ userName: username });
};

exports.postAddFriend = async (req, res) => {
    try {
        const { friendUsername } = req.body;
        const { username } = req.user;

        if (!friendUsername) {
            throwError(400, "unable to find friend username in request body");
        }
        if (!username) {
            throwError(401, "invalid authorization header");
        }

        const user = await getUser({ userName: username });
        const friendUser = await getUser({ userName: friendUsername });

        const friend = await Friend.findOne({
            where: { UserId: user.id, FriendUserId: friendUser.id },
        });

        if (friend) {
            throwError(409, "user already friends");
        }

        await Promise.all(
            [user.addFriendUser(friendUser)],
            [friendUser.addFriendUser(user)],
        );

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.log(error);
        if (!error.status) {
            return res.status(500).json({ ok: false });
        }

        return res.status(error.status).json({ ok: false });
    }
};

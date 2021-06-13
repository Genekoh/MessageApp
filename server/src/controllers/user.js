const User = require("../models/user.js");
const {
    throwError,
    handleError,
    getUser,
    getFriends,
    getAllUserMessages,
    getChannelMembers,
    usersAreFriends,
    getAllUsers,
    getUserChannelsById,
} = require("../util");

exports.getUserInfo = async (req, res) => {
    try {
        const { username } = req.user;

        const user = await getUser({ where: { userName: username } });
        const userChannels = await getUserChannelsById(user.id);

        const messages = await getAllUserMessages(user.id);

        const channels = {};
        await Promise.all(
            userChannels.map(async channel => {
                const channelMembers = await getChannelMembers({
                    where: { ChannelId: channel.id },
                    attributes: ["UserId"],
                    raw: true,
                    include: [
                        {
                            model: User,
                            attributes: ["userName"],
                        },
                    ],
                });
                const channelMemberIds = channelMembers.map(c => c.UserId);

                const users = await getAllUsers({
                    where: { id: channelMemberIds },
                    attributes: ["userName"],
                    raw: true,
                });
                const usernames = users.map(u => u.userName);

                let name = channel.name ? channel.name : usernames.join(", ");

                if (channel.type === "dm" && channelMembers.length === 2) {
                    const friend = users.filter(
                        u => u.userName !== username,
                    )[0];
                    name = friend.userName;
                }

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

        return res.status(200).json({
            ok: true,
            channels,
            username,
            id: user.id,
            errorMessage: "",
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getFriendList = async (req, res) => {
    try {
        const { username } = req.user;

        const user = await getUser({ where: { userName: username } });

        const friendData = await getFriends({
            where: { UserId: user.id },
            include: { model: User, as: "FriendUser" },
        });
        const friendList = friendData.map(f => f.FriendUser);

        return res.status(200).json({ ok: true, friendList, errorMessage: "" });
    } catch (error) {
        handleError(res, error);
    }
};

exports.postProfilePic = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUser({ where: { id } }).catch(e =>
            throwError(401, "unable to find user"),
        );

        const fileName = req.file.filename;
        console.log(fileName);
        user.pathToProfilePic = fileName;
        await user.save();

        res.status(200).json({ ok: true });
    } catch (error) {
        handleError(res, error);
    }
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

        const user = await getUser({ where: { userName: username } });
        const friendUser = await getUser({
            where: { userName: friendUsername },
        });

        const userAreFriends = await usersAreFriends(
            user.userName,
            friendUser.userName,
        );
        if (userAreFriends) {
            throwError(409, "user already friends");
        }

        await Promise.all([
            user.addFriendUser(friendUser),
            friendUser.addFriendUser(user),
        ]);

        return res.status(200).json({ ok: true, errorMessage: "" });
    } catch (error) {
        handleError(res, error);
    }
};

require("dotenv").config();
const User = require("./models/user.js");
const Channel = require("./models/channel.js");
const Friend = require("./models/friend.js");
const bcrypt = require("bcryptjs");

module.exports = async () => {
    let dummyUser1 = await User.findByPk(1);
    let dummyUser2 = await User.findByPk(2);
    let channel = await Channel.findByPk(1);
    let friend1 = await Friend.findByPk(1);
    let friend2 = await Friend.findByPk(2);

    if (!dummyUser1) {
        let password1 = await bcrypt.hash(
            "password123",
            process.env.PASSWORD_SALT,
        );
        dummyUser1 = await User.create({
            userName: "johnDOE",
            password: password1,
            pathToProfilePic: "default.png",
            refreshToken:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdlbmUiLCJpYXQiOjE2MTgyMzQxNTUsImV4cCI6MTYxODgzODk1NX0.bZZEy0K7xg78J5HSYkjzd739GCg1w7TGW6U5XZRp1VY",
        });
    }
    if (!dummyUser2) {
        let password2 = await bcrypt.hash(
            "123password",
            process.env.PASSWORD_SALT,
        );
        dummyUser2 = await User.create({
            userName: "JANEdoe",
            password: password2,
            pathToProfilePic: "default.png",
            refreshToken:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdlbmUiLCJpYXQiOjE2MTgyMzQxNTUsImV4cCI6MTYxODgzODk1NX0.bZZEy0K7xg78J5HSYkjzd739GCg1w7TGW6U5XZRp1VY",
        });
    }
    if (!friend1) {
        await dummyUser1.addFriendUser(dummyUser2);
    }
    if (!friend2) {
        await dummyUser2.addFriendUser(dummyUser1);
    }
    if (!channel) {
        channel = await Channel.create({
            type: "group",
            memberCount: 2,
        });
    }

    await dummyUser1.addChannel(channel, { through: { role: "member" } });
    await dummyUser2.addChannel(channel, { through: { role: "member" } });
};

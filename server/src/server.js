const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const router = require("./routes");
const db = require("./database.js");
const User = require("./models/user.js");
const Channel = require("./models/channel.js");
const ChannelMember = require("./models/channelMember.js");
const Message = require("./models/message.js");

(async () => {
    try {
        const app = express();

        app.use(cors());
        app.use(cookieParser());
        app.use(express.json());
        app.use(router);

        User.belongsToMany(Channel, { through: ChannelMember });
        Channel.belongsToMany(User, {
            through: ChannelMember,
            onDelete: "CASCADE",
        });
        Channel.hasMany(Message);
        Message.belongsTo(Channel);

        // await db.sync({ force: true });
        await db.sync();

        // ! Creating a  dummy user for development
        const bcrypt = require("bcryptjs");
        require("dotenv").config();

        let dummyUser1 = await User.findByPk(1);
        let dummyUser2 = await User.findByPk(2);
        let channel = await Channel.findByPk(1);

        if (!dummyUser1) {
            let password1 = await bcrypt.hash(
                "password123",
                process.env.PASSWORD_SALT,
            );
            dummyUser1 = await User.create({
                userName: "johnDOE",
                email: "john@doe.com",
                password: password1,
                pathToProfilePic: "/img/foo.png",
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
                email: "doe@jane.com",
                password: password2,
                pathToProfilePic: "/img/bar.png",
                refreshToken:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdlbmUiLCJpYXQiOjE2MTgyMzQxNTUsImV4cCI6MTYxODgzODk1NX0.bZZEy0K7xg78J5HSYkjzd739GCg1w7TGW6U5XZRp1VY",
            });
        }
        if (!channel) {
            channel = await Channel.create({
                memberCount: 2,
                lastMessageDate: new Date(),
            });
        }

        await dummyUser1.addChannel(channel, { through: { role: "member" } });
        await dummyUser2.addChannel(channel, { through: { role: "member" } });

        // ! END OF DEVELOPMENT ONLY CODE

        const server = app.listen(3000);
        console.log("---- Server online ----");
        const io = require("./io.js").init(server);

        io.on("connection", socket => {
            console.log("---- A client has connected ----");
        });
    } catch (err) {
        console.log("hi");
        console.log(err);
    }
})();

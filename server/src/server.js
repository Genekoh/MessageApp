require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const router = require("./routes");
const db = require("./database.js");
const User = require("./models/user.js");
const Channel = require("./models/channel.js");
const ChannelMember = require("./models/channelMember.js");
const Message = require("./models/message.js");
const Friend = require("./models/friend.js");

(async () => {
    try {
        const app = express();
        app.use(
            cors({
                credentials: true,
                methods: ["GET", "POST", "DELETE", "OPTIONS"],
                origin: process.env.CLIENT_URL.split(","),
            }),
        );
        app.use(cookieParser());
        app.use(express.json());
        app.use(router);

        User.belongsToMany(Channel, { through: ChannelMember });
        User.hasMany(ChannelMember);
        ChannelMember.belongsTo(User);
        Channel.belongsToMany(User, {
            through: ChannelMember,
            onDelete: "CASCADE",
        });
        Channel.hasMany(Message);
        Message.belongsTo(Channel);
        User.hasMany(Message);
        User.belongsToMany(User, {
            through: Friend,
            as: "FriendUser",
        });
        Friend.belongsTo(User);
        Friend.belongsTo(User, { as: "FriendUser" });
        User.hasMany(Friend);

        // await db.sync({ force: true });
        await db.sync();

        // ! Creating a  dummy user for development
        require("./dev.js")();

        // ! END OF DEVELOPMENT ONLY CODE
        const server = app.listen(3000);
        console.log("---- Server online ----");
        const io = require("./socket.js").init(server);

        io.on("connection", async socket => {
            console.log("---- A client has connected ----");
            socket.on;
        });
    } catch (err) {
        console.log(err);
    }
})();

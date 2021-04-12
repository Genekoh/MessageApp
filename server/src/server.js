const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const router = require("./routes");
const db = require("./database.js");
const User = require("./models/user.js");
const Channel = require("./models/channel.js");
const ChannelMember = require("./models/channelMember.js");

(async () => {
    const app = express();

    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use(router);

    User.belongsToMany(Channel, { through: ChannelMember });
    Channel.belongsToMany(User, { through: ChannelMember });

    await db.sync({ force: true });
    // await db.sync();

    const server = app.listen(3000);
    const io = require("./socket.js").init(server);

    io.on("connection", socket => {
        console.log("A client has connected");
    });
})();

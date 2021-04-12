const { DataTypes, Model } = require("sequelize");

const sequelize = require("../database.js");

class Channel extends Model {}

Channel.init(
    {
        members: DataTypes.ARRAY(DataTypes.INTEGER),
        lastMessageData: DataTypes.DATE,
    },
    { sequelize, modelName: "Channel" },
);

module.exports = Channel;

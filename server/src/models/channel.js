const { DataTypes, Model } = require("sequelize");

const sequelize = require("../database.js");

class Channel extends Model {}

Channel.init(
    {
        memberCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lastMessageDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    { sequelize, modelName: "Channel" },
);

module.exports = Channel;

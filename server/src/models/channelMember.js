const { DataTypes, Model } = require("sequelize");

const sequelize = require("../database.js");

class ChannelMember extends Model {}

ChannelMember.init(
    {
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { sequelize, modelName: "ChannelMember" },
);

module.exports = ChannelMember;

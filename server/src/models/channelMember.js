const { DataTypes, Model } = require("sequelize");

const sequelize = require("../database.js");

class ChannelMember extends Model {}

ChannelMember.init(
    {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: ["member", "admin"],
            },
        },
    },
    { sequelize, modelName: "ChannelMember" },
);

module.exports = ChannelMember;

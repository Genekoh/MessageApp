const { text } = require("express");
const { DataTypes, Model } = require("sequelize");

const sequelize = require("../database.js");

class Channel extends Model {}

Channel.init(
    {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isValidChannelType(value) {
                    if (value !== "group" && value !== "dm") {
                        throw new Error("Not a valid channel type");
                    }
                },
            },
        },
        name: {
            type: DataTypes.STRING,
        },
        memberCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { sequelize, modelName: "Channel" },
);

module.exports = Channel;

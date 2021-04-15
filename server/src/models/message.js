const { DataTypes, Model } = require("sequelize");

const sequelize = require("../database.js");

class Message extends Model {}

Message.init(
    {
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    { sequelize, modelName: "Message" },
);

module.exports = Message;

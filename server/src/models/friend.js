const { DataTypes, Model, INTEGER } = require("sequelize");

const sequelize = require("../database.js");

class Friend extends Model {}

Friend.init(
    {
        // UserId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        // FriendId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
    },
    {
        sequelize,
        modelName: "Friend",
    },
);

module.exports = Friend;

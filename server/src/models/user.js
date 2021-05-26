const { DataTypes, Model } = require("sequelize");

const sequelize = require("../database.js");

class User extends Model {}

User.init(
    {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 15],
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isOverMinLength(value) {
                    if (value.length <= 5) {
                        throw new Error(
                            "Password has have a length greater than 5",
                        );
                    }
                },
            },
        },
        pathToProfilePic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refreshToken: DataTypes.STRING,
        // channels: DataTypes.ARRAY(DataTypes.STRING),
    },
    { sequelize, modelName: "User" },
);

module.exports = User;

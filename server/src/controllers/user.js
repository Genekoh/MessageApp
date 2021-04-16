const User = require("../models/user.js");

exports.getUserInfo = async (req, res) => {
    try {
        const username = req.params.username;

        const user = await User.findOne({ where: { userName: username } });
    } catch (error) {}
};

exports.getMessages = async (req, res) => {
    try {
    } catch (error) {}
};

/*
channels
*/

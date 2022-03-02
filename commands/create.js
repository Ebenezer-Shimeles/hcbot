
const { User } = require("../models/user");
const bcrypt = require("bcrypt");


const createHandle = (bot, msg) => {
    const salt = bcrypt.genSalt(10);

    const hash = bcrypt.hashSync(msg.chat.id, salt);

    bot.sendMessage(msg.chat.id, hash);
}

module.exports = {
    "/create": createHandle
}
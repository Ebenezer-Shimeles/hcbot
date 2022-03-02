
const STRS = require('../strings');
const { User, createUser } = require("../models/user");

const startHandle = async (bot, msg) => {

    if (!await User.findOne({
        where: {
            tg_id: msg.chat.id
        }
    })) createUser(msg.chat.id, "Anon");

    bot.sendMessage(
        msg.chat.id,
        STRS()['intro']
    )
}
module.exports = {
    "/start": startHandle
}
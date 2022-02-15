
const STRS = require('../strings');

const startHandle = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        STRS()['intro']
    )
}
module.exports = {
    "/start": startHandle
}
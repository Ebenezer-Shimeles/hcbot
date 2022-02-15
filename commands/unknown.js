const STRS = require('../strings');

const unknownHandle = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        STRS()['unknown']
    )
}
module.exports = {
    "unknown": unknownHandle
}
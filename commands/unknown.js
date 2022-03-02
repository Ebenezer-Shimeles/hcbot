const STRS = require('../strings');

const unknownHandle = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        STRS()['unknown'] + ` I dont know this command: '${msg.text}'`
    )
}
module.exports = {
    "unknown": unknownHandle
}
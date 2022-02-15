const STRS = require('../strings');

const creditsHandle = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        STRS()['credits']
    )
}
module.exports = {
    "/credits": creditsHandle
}
const STRS = require('../strings');

const creditsHandle = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        STRS()['credits'],
        {
            parse_mode: 'HTML'
        }
    )
}
module.exports = {
    "/credits": creditsHandle
}


const helpHandler = (bot, msg) => {
    bot.sendMessage(msg.chat.id, "/mylink - to get your link\n/talkto - to talk by id\n/myblocks - to get all users blocked by you\n/credits - to see who made it\n/help - to see all commands")
}

module.exports = {
    '/help': helpHandler
}
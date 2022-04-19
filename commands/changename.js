const { setUserState } = require("../models/user");
const { CHAGNAM } = require("./states")


const changeNameHandler = async (bot, msg) => {
    await setUserState(msg.chat.id, CHAGNAM);
    bot.sendMessage(msg.chat.id, "Ok! <i><b>send me your new name for this bot</b></i>", {
        parse_mode: "HTML"
    });
  
}

module.exports = {
    '/changemyname': changeNameHandler
}
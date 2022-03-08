const { setUserState } = require("../models/user");
const { CHAGNAM } = require("./states")

const changeNameHandler = (bot, msg) => {
    bot.sendMessage(msg.chat.id, "Ok! <i><b>send me your new name</b></i>", {
        parse_mode: "HTML"
    });
    setUserState(msg.chat.id, CHAGNAM);
}

module.exports = {
    '/changemyname': changeNameHandler
}
const { User, createUser } = require("../models/user");
const { BOT_USERNAME } = require("../const");
const { getRandomInt } = require("../utils");


const myLinkHandler = async (bot, msg) => {
    let user = await User.findOne({
        where: {
            tg_id: msg.chat.id
        }
    });
    if (!user) {
        user = await createUser(msg.chat.id); //change this please
    }
    const link = user.link;
    //bot.sendMessage("dsds", {})
    bot.sendMessage(msg.chat.id, `Your link is: <b>${"t.me/" + BOT_USERNAME + "?start=" + link}</b>\n\n\n<b>Put this somewhere other people can see.... and when they touch it they can talk to you  through this bot</b>(without them knowing ur real tg account)`, {
        parse_mode: "HTML"
    });
    setTimeout(() =>{bot.sendMessage(msg.chat.id, "If you want to change ur name for this bot<b> you can change that using /changemyname command</b>",
    {
        parse_mode: "HTML"
    });}, 5000)
}
module.exports = {
    "/mylink": myLinkHandler
}
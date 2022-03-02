const { User, createUser } = require("../models/user");
const { BOT_USERNAME } = require("../const")


const myLinkHandler = async (bot, msg) => {
    let user = await User.findOne({
        where: {
            tg_id: msg.chat.id
        }
    });
    if (!user) {
        user = await createUser(msg.chat.id, "Anon"); //change this please
    }
    const link = user.link;
    //bot.sendMessage("dsds", {})
    bot.sendMessage(msg.chat.id, `Your link is: <b>${"t.me/" + BOT_USERNAME + "?start=" + link}</b>\nPut is somewhere other people can see and when they touch it you can talk through this bot(without them knowing ur real tg account)`, {
        parse_mode: "HTML"
    });
}
module.exports = {
    "/mylink": myLinkHandler
}
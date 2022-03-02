//const HC = require("../bot")
const { User, getUserBlocks } = require("../models/user");
const { UNBLOCK } = require("./states");
require("dotenv").config()

const myBlocksHandler = async (bot, msg) => {
    const blocks = await getUserBlocks(msg.chat.id);
    blocks.forEach((block) => {
        bot.sendMessage(msg.chat.id, `<b><i>User:</i></b> ${block.tg_name}\n Link: ${block.link}`,
            {
                reply_markup: {
                    inline_keyboard: [[{
                        callback_data: `${UNBLOCK}${process.env.DIFF_CHAR}${block.tg_id}`,
                        text: "Unblock"
                    }]]
                }, parse_mode: "HTML"
            });
    })
}

module.exports = {
    '/myblocks': myBlocksHandler
}
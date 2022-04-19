
const STRS = require('../strings');
const { User, createUser } = require("../models/user");

const {reportToAdmin, escapeHtml} = require('../utils')
const startHandle = async (bot, msg) => {

    if (!await User.findOne({
        where: {
            tg_id: msg.chat.id
        }
    })) createUser(msg.chat.id);
    
    reportToAdmin(`<a href = 'tg://user?id=${msg.chat.id}'>New user</a> => <i>${escapeHtml(msg.chat.first_name)}</i>`, {
        parse_mode: 'HTML'
    })
    bot.sendMessage(
        msg.chat.id,
        STRS()['intro'],
        {
            parse_mode: 'HTML'
        }
    )
}
module.exports = {
    "/start": startHandle
}
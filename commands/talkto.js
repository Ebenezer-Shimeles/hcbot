const crypto = require("crypto");
const chalk = require("chalk")

const STRS = require("../strings");
const { User, setUserStateVal } = require("../models/user");
const { TTGK, registerStateHandler, SEMSG } = require("./states")



const talkToHandle = async (bot, msg) => {

    bot.sendMessage(msg.chat.id, STRS()['talkto']);


    const theSenderUser = await User.findOne({
        where: {
            tg_id: msg.chat.id
        }
    });
    if (!theSenderUser) {
        // crypto.rand
        console.log(`${chalk.green("User doesnot exist creating")}`)
        const newUser = User.build({
            tg_id: msg.chat.id,
            tg_name: msg.chat.name,
            link: "t.me/hidden_chat_bot?start=" + crypto.randomBytes(64).toString("hex") //change this to AES encrypt
        })
        console.log(`data ${chalk.red(JSON.stringify(newUser))}`)
        await newUser.save()
    }
    else {

        // /theSenderUser.state = TTGK;
        // theSenderUser.save();
        await User.update({ state: TTGK }, {
            where: {
                tg_id: theSenderUser.tg_id
            }
        });
        console.log(chalk.red("Trying to talk!"));
    }


}

module.exports = {
    "/talkto": talkToHandle
}
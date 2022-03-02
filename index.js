
const express = require("express");

const HC = require('./bot');

const { handleState, registerStateHandler, TTGK, SEMSG, registerCallbackSKWHandler, BLOCK, REPLY, handleCallbackKw } = require("./commands/states");

const startHeaders = require("./commands/start");
const unknownHeaders = require("./commands/unknown");
const creditsHeaders = require("./commands/credits")
const createHeaders = require("./commands/create");
const talkToHandle = require("./commands/talkto");
const myLinkHeaders = require("./commands/mylink");

const { User, createUser } = require("./models/user.js");

const commands = { ...startHeaders, ...unknownHeaders, ...creditsHeaders, ...createHeaders, ...talkToHandle, ...myLinkHeaders };

app = express()
app.get('/', (req, res) => {
    res.end('ok')
})

app.use(express.json())
app.post('/', (req, res) => {
    HC.processUpdate(req.body)

    res.end("ok")
})

HC.on('new_chat_members', (msgData) => {
    const chatType = msgData.chat.type;
    const chatId = msgData.chat.id;
    if (chatType == 'group' || chatType == 'supergroup') {
        HC.sendMessage(chatId, "I do not work in groups sorry!");
        HC.leaveChat(chatId);
    }
});

registerCallbackSKWHandler(REPLY, ({ callbackData }) => {
    HC.sendMessage("556659349", "S");
});
registerCallbackSKWHandler(BLOCK, ({ callbackData }) => {
    HC.sendMessage("556659349", "BLCOK")
});
HC.on('callback_query', async (callbackData) => {
    // HC.sendMessage(callbackData.from.id, callbackData.data);
    if (callbackData.chat_instance == 'group' || callbackData.chat_instance == 'supergroup') return;
    //check uppper pls

    const data = callbackData.data;
    const fromId = callbackData.from.id;
    let user = await User.findOne({ where: { tg_id: fromId } });

    if (!user) user = await createUser(fromId, "Anon");

    const keyWord = data.split('-')[0];


    HC.sendMessage("556659349", keyWord);
    handleCallbackKw(keyWord, { callbackData });

    // if (user.state) {
    //     HC.sendMessage(msg.chat.id, "You have a state: " + state);
    //     handleState(await user.state, { msgData: {}, inlineData: {}, callbackData });
    // }
    // else {
    //     HC.sendMessage("556659349", keyWord);
    // }
});





/////////////////////////////////////////////////////////////////////////////////////////////
registerStateHandler(TTGK, async ({ msgData }) => {
    //HC.sendMessage(msgData.chat.id, msgData.text)
    const msg = msgData;
    const user = await User.findOne({ where: { tg_id: msg.chat.id } });
    //register talk to name
    await User.update({
        stateVal: msgData.text,
        state: SEMSG
    }, {
        where: {
            tg_id: user.tg_id
        }
    });
    HC.sendMessage(msgData.chat.id, "Ok send me the message you want to send");
});
registerStateHandler(SEMSG, async ({ msgData }) => {
    const msg = msgData;
    const user = await User.findOne({ where: { tg_id: msg.chat.id } });
    HC.sendMessage(msg.chat.id, "sent!");
    const reciever = await User.findOne({
        where: {
            tg_id: user.stateVal
        }
    });
    HC.sendMessage(reciever.tg_id,

        "<b>from: " + `${user.tg_name}\n</b>` +
        `Msg: <i>${msg.text}</i>`,

        {
            parse_mode: "HTML",

            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Reply",
                        callback_data: `${REPLY}-${user.tg_id}`
                    },
                    {
                        text: "Block this user",
                        callback_data: `${BLOCK}-${user.tg_id}`
                    }]
                ]
            }
        });
});
HC.on('text', async (msg) => {
    const user = await User.findOne({ where: { tg_id: msg.chat.id } });
    console.log("user: " + JSON.stringify(user));
    const state = user ? user.state : console.log("No state user");

    ///////////////////////////////////////////////////////////////////////////////////////////////
    if (state) {
        HC.sendMessage(msg.chat.id, "You have a state: " + state);
        handleState(await user.state, { msgData: msg, inlineData: {}, callbackData: {} });
    }
    else if (msg.text.startsWith("/start") && msg.text != "/start") {
        const payload = msg.text.split("/start")[1];
        //HC.sendMessage(msg.chat.id, "Deeplinking, " + payload);
        const wantsToTalkto = await User.findOne({
            where: {
                link: payload.trim()
            }
        })
        if (!wantsToTalkto) return HC.sendMessage(msg.chat.id, "This link does not exist bitch")
        await User.update({
            state: SEMSG,
            stateVal: wantsToTalkto.tg_id
        }, {
            where: {
                tg_id: msg.chat.id
            }
        });
        HC.sendMessage(msg.chat.id, "Send me the message you want to send!");

    }
    else if (msg.text.startsWith('/')) {
        //console.log("Lookup ", commands)
        if (commands[msg.text])
            commands[msg.text](HC, msg)
        else
            commands["unknown"](HC, msg)
    }
    else {
        HC.sendMessage("556659349", "Uknown usage!");
    }
})

app.listen(8000, (e) => {
    if (e) console.error("Error " + e);
    console.log("Listening at 8000")
})
try{
const express = require("express");

const HC = require('./bot');

const { handleState, registerStateHandler, TTGK, CANCELREPLY,SEMSG, CHAGNAM, registerCallbackSKWHandler, BLOCK, UNBLOCK, REPLY, handleCallbackKw } = require("./commands/states");

const startHeaders = require("./commands/start");
const unknownHeaders = require("./commands/unknown");
const creditsHeaders = require("./commands/credits")
const createHeaders = require("./commands/create");
const talkToHandle = require("./commands/talkto");
const myLinkHeaders = require("./commands/mylink");
const myBlocksHeaders = require("./commands/myblocks");
const helpHeaders = require("./commands/help");
const changeMyNameHeaders = require("./commands/changename");

const { User, createUser, setUserState, setUserStateVal,setUSerStateVal2 } = require("./models/user.js");

const { reportToAdmin, getRandomInt } = require("./utils");
require("dotenv").config()

const commands = { ...changeMyNameHeaders, ...helpHeaders, ...startHeaders, ...unknownHeaders, ...creditsHeaders, ...createHeaders, ...talkToHandle, ...myLinkHeaders, ...myBlocksHeaders };

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

registerCallbackSKWHandler(UNBLOCK, async ({ callbackData }) => {
    const user = await User.findOne({ where: { tg_id: callbackData.from.id } });
    const otherData = callbackData.data.split(process.env.DIFF_CHAR)[1];
    if (!user) return reportToAdmin("Empty reply called bro!");
    const unblocked = await User.findOne({ where: { tg_id: otherData } });
    if ((!unblocked)) HC.sendMessage(user.tg_id, "This user doesn't exist!");
    await user.removeBlocked(unblocked);
    HC.sendMessage(callbackData.from.id, "Unblock successful")
});
registerCallbackSKWHandler(CANCELREPLY, async ({callbackData}) =>{

    const user = await User.findOne({ where: { tg_id: callbackData.from.id } });
    if(!user ) return;  //cancel works for accounts that exist

    setUserState(user['tg_id'], "");

    HC.answerCallbackQuery(callbackData.id, "Cancelled!");
    HC.sendMessage(callbackData.message.chat.id, "Cancellled!");

    

});
registerCallbackSKWHandler(REPLY, async ({ callbackData }) => {
    //HC.sendMessage("556659349", "S");
    //reportToAdmin("REPLY CLICKED");
    const user = await User.findOne({ where: { tg_id: callbackData.from.id } });
    const otherData = callbackData.data.split(process.env.DIFF_CHAR)[1];
    const replyTo = callbackData.data.split(process.env.DIFF_CHAR)[2];
    if (!user) return reportToAdmin("Empty reply called bro!");
    if ((!await User.findOne({ where: { tg_id: otherData } }))) HC.sendMessage(user.tg_id, "This user doesn't exist!");
    if (!await setUserState(user.tg_id, SEMSG)) return reportToAdmin("Error cannot change user state");
    if (!await setUserStateVal(user.tg_id, otherData)) return reportToAdmin("Error cannot change state val");
    //the next one is to reply to make the confusion low
    reportToAdmin(`Registerting callback father: ${replyTo}`);
    if (!await setUSerStateVal2(user.tg_id, replyTo)) return reportToAdmin("Error cannot change state val 2");
    HC.sendMessage(callbackData.from.id, "Please send me the message(text or image) you want to send for replying:",
    {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        "callback_data": CANCELREPLY,
                        "text": "Cancel"
                    }
                ]
            ]
        }
    });


});
registerCallbackSKWHandler(BLOCK, async ({ callbackData }) => {
    const user = await User.findOne({ where: { tg_id: callbackData.from.id } });
    const otherData = callbackData.data.split(process.env.DIFF_CHAR)[1];
    if (!user) return reportToAdmin("Empty reply called bro!");
    const blocked = await User.findOne({ where: { tg_id: otherData } })
    if (!(blocked)) return HC.sendMessage(callbackData.from.id, "The use does not exist!");
    await user.addBlocked(blocked);
    HC.sendMessage(`${callbackData.from.id}`, `The user ${blocked.tg_name} has been blocked! to unblock use /myblocks`);
});
HC.on('callback_query', async (callbackData) => {
    // HC.sendMessage(callbackData.from.id, callbackData.data);
    reportToAdmin(`Callback Query ${callbackData.data}`);
    if (callbackData.chat_instance == 'group' || callbackData.chat_instance == 'supergroup') return;
    //check uppper pls

    const data = callbackData.data;
    const fromId = callbackData.from.id;
    let user = await User.findOne({ where: { tg_id: fromId } });
    
    const keyWord = data.split(process.env.DIFF_CHAR)[0];


    HC.sendMessage("556659349", keyWord);
    handleCallbackKw(keyWord, { callbackData });

    
}
);





/////////////////////////////////////////////////////////////////////////////////////////////
registerStateHandler(CHAGNAM, async ({ msgData }) => {
    const user = User.findOne({
        where: {
            tg_id: msgData.chat.id
        }
    }).then(data => {
        if (!data) return;
        else return User.update({
            tg_name: msgData.text,
            state: ""
        },
            {
                where: {
                    tg_id: msgData.chat.id
                }
            });
    })
        .then(() => HC.sendMessage(msgData.chat.id, "Change successful!"))
});
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

    const reciever = await User.findOne({
        where: {
            tg_id: user.stateVal
        }
    });
    if (!reciever || !user) return HC.sendMessage(msgData.chat.id, "The user does not exist!");

    if (await reciever.hasBlocked(user)) {
        HC.sendMessage(msg.chat.id, "This user has blocked you!");
        return;
    }

    HC.sendMessage(msg.chat.id, "sent!");
    //reportToAdmin(`reply id: ${JSON.stringify(user)}`);
    //reportToAdmin(`${JSON.stringify(reciever)}`)
    const replyTo = user.stateVal2 || "";
    reportToAdmin(`replyTo ${replyTo}`);
    if(msg.text) HC.sendMessage(reciever.tg_id,

        "<b>from: " + `${user.tg_name}</b>\n\n` +
        `Msg: <i>${msg.text}</i>`,

        {
           reply_to_message_id: replyTo,
            parse_mode: "HTML",

            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Reply",
                        callback_data: `${REPLY}${process.env.DIFF_CHAR}${user.tg_id}${process.env.DIFF_CHAR}${msg['message_id']}`
                    },
                    {
                        text: "Block This User",
                        callback_data: `${BLOCK}${process.env.DIFF_CHAR}${user.tg_id}`
                    }]
                ]
            }
        });
    else if(msg.photo){
        //HC.sendMessage(msg.chat.id, "Image");
        const imageId = msg.photo[0]['file_id'];
        let caption = msg.caption || "";

        HC.sendPhoto(reciever.tg_id, `${imageId}`, {caption: 
            `<i>${caption}</i>\n\n ` + 
            "<b>from: " + `${user.tg_name}\n</b>` 
        
        
        , parse_mode: "HTML", 
        reply_to_message_id: replyTo,
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Reply",
                    callback_data: `${REPLY}${process.env.DIFF_CHAR}${user.tg_id}`
                },
                {
                    text: "Block This User",
                    callback_data: `${BLOCK}${process.env.DIFF_CHAR}${user.tg_id}`
                }]
            ]}
        }
        );
    }
    if (!await setUserState(user.tg_id, "")) reportToAdmin("Error cannot change user state");
});



HC.on('message',async (msg)=>{ 
     if(msg['photo']) {  //this is the only place we use images
         // reportToAdmin(`Image ${msg['photo'][0]['file_id']}`)
         let user = await User.findOne({ where: { tg_id: msg.chat.id } });
   
         const state = user ? user.state : console.log("No state user");

         ///////////////////////////////////////////////////////////////////////////////////////////////
        if (state && state === SEMSG) {  ///this is the only state that needs images
           HC.sendMessage(msg.chat.id, "You have a state: " + state);
            handleState(await user.state, { msgData: msg, inlineData: {}, callbackData: {} });
        }
     }
  }
);





HC.on('text', async (msg) => {
    let user = await User.findOne({ where: { tg_id: msg.chat.id } });
    //console.log("user: " + JSON.stringify(user));
    const state = user ? user.state : console.log("No state user");

    ///////////////////////////////////////////////////////////////////////////////////////////////
    if (state) {
        HC.sendMessage(msg.chat.id, "You have a state: " + state);
        handleState(await user.state, { msgData: msg, inlineData: {}, callbackData: {} });
    }
    else if (msg.text.startsWith("/start") && msg.text != "/start") {
        if (!user) {
            reportToAdmin("Doesn't exist");
            user = await createUser(msg.chat.id)
        }
        const payload = msg.text.split("/start")[1];
        //HC.sendMessage(msg.chat.id, "Deeplinking, " + payload);
        const wantsToTalkto = await User.findOne({
            where: {
                link: payload.trim()
            }
        })
        if (!wantsToTalkto) return HC.sendMessage(msg.chat.id, "This link does not exist!")
        // await User.update({
        //     state: SEMSG,
        //     stateVal: wantsToTalkto.tg_id
        // }, {
        //     where: {
        //         tg_id: msg.chat.id
        //     }
        // });
        reportToAdmin(`${msg.chat.id} to ${wantsToTalkto.tg_id}`);
        if (!await setUserState(msg.chat.id, SEMSG)) return reportToAdmin("Error cannot change user state");
        if (!await setUserStateVal(msg.chat.id, `${wantsToTalkto.tg_id}`)) return reportToAdmin("Error cannot change user state val");
        HC.sendMessage(msg.chat.id, "Send me the message you want to send!", {
           
        });

    }
    else if (msg.text.startsWith('/')) {
        //console.log("Lookup ", commands)
        if (commands[msg.text])
            commands[msg.text](HC, msg)
        else
            commands["unknown"](HC, msg)
    }
    else {
        commands["unknown"](HC, msg);
        // HC.sendMessage("556659349", "Uknown usage!");
    }
})

app.listen(8000, (e) => {
    if (e) console.error("Error " + e);
    else console.log("Listening at 8000")
})
}catch(e){
    reportToAdmin(`Exception Found! ${e}`)
}
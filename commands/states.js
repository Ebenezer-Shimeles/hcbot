const chalk = require("chalk");
const { HC } = require("../bot");

/////////////msg states
const TTGK = "TALKTOGETSTATE";
const SEMSG = "SENDINGMESSAGE";



/////////////callback keywords
const BLOCK = 'bl'
const UNBLOCK = 'un'
const REPLY = 'rep'




const stateNHandlers = {};
const callbackKWNHandlers = {}



const registerStateHandler = (stateStr, callback) => {

    //stateNHandlers.push({ stateStr, callback });
    stateNHandlers[stateStr] = callback;
    console.log(chalk.blue("Registered :" + stateStr + " " + stateNHandlers.toString()));
}

const registerCallbackSKWHandler = (kwStr, callback) => {
    callbackKWNHandlers[kwStr] = callback;
    console.log(chalk.green(`Registered: Callback keyword ${kwStr}`))
}

const handleState = (stateStr, { msgData = {}, inlineData = {}, callbackData = {}, }) => {
    if (stateNHandlers[stateStr]) {
        stateNHandlers[stateStr]({ callbackData, msgData, inlineData });
    } else {
        console.log(chalk.yellow("Error empty handler called " + stateStr + " " + stateNHandlers[stateStr]));
    }
}
const handleCallbackKw = (kw, { callbackData }) => {
    if (callbackKWNHandlers[kw]) {
        callbackKWNHandlers[kw]({ callbackData });
    }
    else {
        console.log(chalk.yellow("Error empty handler called " + stateStr + " " + stateNHandlers[stateStr]));
        HC.answerCallbackQuery(callbackData.id, "Wrong button!");
    }
}
module.exports = {
    handleState,
    registerStateHandler,
    registerCallbackSKWHandler,
    handleCallbackKw,
    TTGK,
    SEMSG,
    BLOCK,
    REPLY,
    UNBLOCK
}
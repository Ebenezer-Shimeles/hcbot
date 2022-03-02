const chalk = require("chalk");

const TTGK = "TALKTOGETSTATE";
const SEMSG = "SENDINGMESSAGE";




const stateNHandlers = {};



const registerStateHandler = (stateStr, callback) => {

    //stateNHandlers.push({ stateStr, callback });
    stateNHandlers[stateStr] = callback;
    console.log(chalk.blue("Registered :" + stateStr + " " + stateNHandlers.toString()));
}

const handleState = (stateStr, { msgData = {}, inlineData = {}, callbackData = {}, }) => {
    if (stateNHandlers[stateStr]) {
        stateNHandlers[stateStr]({ callbackData, msgData, inlineData });
    } else {
        console.log(chalk.yellow("Error empty handler called " + stateStr + " " + stateNHandlers[stateStr]));
    }
}
module.exports = {
    handleState,
    registerStateHandler,
    TTGK,
    SEMSG
}
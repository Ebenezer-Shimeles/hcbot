const Bot = require('node-telegram-bot-api');
const DotEnv = require("dotenv");

DotEnv.config();

const HC = new
    Bot(process.env.BOT_TOKEN, { polling: false })





HC.setWebHook("https://a012-197-156-95-71.ngrok.io")
module.exports = HC 
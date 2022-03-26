const Bot = require('node-telegram-bot-api');
const DotEnv = require("dotenv");

DotEnv.config();

const HC = new
    Bot(process.env.BOT_TOKEN, { polling: false })





HC.setWebHook("https://76da-197-156-107-79.ngrok.io")
module.exports = HC 
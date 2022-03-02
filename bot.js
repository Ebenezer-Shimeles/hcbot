const Bot = require('node-telegram-bot-api');
const DotEnv = require("dotenv");

DotEnv.config();

const HC = new
    Bot(process.env.BOT_TOKEN, { polling: false })





HC.setWebHook("https://fc0f-197-156-77-177.ngrok.io")
module.exports = HC 
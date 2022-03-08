const Bot = require('node-telegram-bot-api');
const DotEnv = require("dotenv");

DotEnv.config();

const HC = new
    Bot(process.env.BOT_TOKEN, { polling: false })





HC.setWebHook("https://0f88-197-156-77-236.ngrok.io")
module.exports = HC 
const crypto = require("crypto")

require("dotenv").config();
const HC = require("./bot");

const getRandomInt = (min, max) => {
    
    const randD = Math.random();
    const randMax = Math.ceil(randD * max);
    if (randMax < min) return min;
    return randMax;
}
function isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
};

function encrypt(text) {
    var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
function reportToAdmin(msg, others = {}) {
    HC.sendMessage(process.env.ADMIN_ID, msg, others);
}
module.exports = {
    encrypt,
    decrypt,
    getRandomInt,
    isAlphaNumeric,
    reportToAdmin
}
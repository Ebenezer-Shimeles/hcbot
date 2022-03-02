function STRS(lang = 'EN') {

    const retLang = {};


    switch (lang) {
        case "EN":
            retLang["intro"] = "Hello 👋 you can use me to talk to strangers without them viewing your telegram account\nSend /create to create your access account"
            retLang['unknown'] = "Unknown commands!\n\Please use /help to get information."
            retLang['credits'] = "Made by @Silent_Storm_admin\n Join my channel for other product https://t.me/SilentStormET 🇪🇹🇪🇹"
            retLang['talkto'] = 'OK send me the address of the person you want to talk to:'
    }
    return retLang
}


module.exports = STRS;
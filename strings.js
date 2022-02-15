function STRS(lang = 'EN') {

    const retLang = {};


    switch (lang) {
        case "EN":
            retLang["intro"] = "Hello 👋 you can use me to talk to strangers without them vieing your telegram account\nSend /create to create your access account"
            retLang['unknown'] = "Unknown commands!\n\Please use /help to get information."
            retLang['credits'] = "Made by @Silent_Storm_admin\n Join my channel for other product https://t.me/SilentStormET 🇪🇹🇪🇹"
    }
    return retLang
}


module.exports = STRS;
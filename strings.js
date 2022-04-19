function STRS(lang = 'EN') {

    const retLang = {};


    switch (lang) {
        case "EN":
            retLang["intro"] = "Hello 👋\n <b>You can use me to talk to strangers without them knowing your real telegram account</b>.\n\nUse /mylink to get your link."
            retLang['unknown'] = "Unknown commands!\n\Please use /help to get information."
            retLang['credits'] = "<b>And I also make bots, mobile apps and websites for a very cheap price ;) starting from $25</b>\n\n\n\n" + "Made by @Silent_Storm_admin\n Join my channel for other products https://t.me/SilentStormET 🇪🇹🇪🇹\n "
            retLang['talkto'] = 'OK send me the address of the person you want to talk to:'
    }
    return retLang
}


module.exports = STRS;
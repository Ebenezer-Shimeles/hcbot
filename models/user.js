const Db = require("./db");


const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;
const { getRandomInt, encrypt, reportToAdmin } = require("../utils")
const { isAlphaNumeric } = require("../utils");

const DotEnv = require("dotenv");
const { is } = require("express/lib/request");
const { where } = require("sequelize");
//const Sequelize = require("sequelize");

DotEnv.config();

const vars = process.env;

//console.log(process.env, vars.DB_NAME, vars.DB_USER, vars.DB_PASS);


const User = Db.define("users", {
    tg_id: {
        unique: true,
        allowNull: false,
        type: DataTypes.INTEGER
    },
    tg_name: {
        type: DataTypes.STRING
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // get() {
        //     return + "t.me/hidden_chat_bot?start=" + this.getDataValue('link');
        // }
    },
    state: {
        type: DataTypes.STRING
    },
    stateVal: {
        type: DataTypes.STRING
    },
    stateVal2: {
        type: DataTypes.STRING
    },

}, {
    freezeTablename: true,
    paranoid: true
}
);



const setUserState = async (userId, state) => {
    let user = await User.findOne({ where: { tg_id: userId } });
    if (!user) {
        user = await createUser(userId, "Anon");
    };
    reportToAdmin(`state.of(${user.tg_id}) = ${state}`)
    await User.update(
        {
            state: `${state}`
        },
        {
            where: {
                tg_id: user.tg_id
            }
        }
    );
    user = await User.findOne({ where: { tg_id: userId } });
    reportToAdmin(`state.of(${user.tg_id}) = ${user.state}`)
    return true;
}
const setUserStateVal = async (userId, stateVal) => {
    const user = await User.findOne({ where: { tg_id: userId } });
    if (!user) return false;
    await User.update(
        {
            stateVal
        },
        {
            where: {
                tg_id: user.tg_id
            }
        }
    );
    return true;
}
const setUSerStateVal2 = async (userId, stateVal2) => {
    const user = await User.findOne({ where: { tg_id: userId } });
    if (!user) return false;
    await User.update(
        {
            stateVal2
        },
        {
            where: {
                tg_id: user.tg_id
            }
        }
    );
    return true;
}
const genLink = (tgId) => {
    // let llink = await encrypt(tg_id.toString());

    // llink = link.split("")
    //     .filter(data => data != '$' && data != '*' && data != ';' && data != ';' && data != '-')
    //     .forEach(char => link += char)
    let link = "";
    let encryptor = require('simple-encryptor')("aaaaaaaaaaaaaaaa");

    tmpLink = encryptor.encrypt(tgId.toString())
    tmpLink.split('')
        .forEach(data => {
            if (isAlphaNumeric(data)) link += data;
        })
    let randomInt = getRandomInt(0, tmpLink.length - 20);
    return link.substring(randomInt, randomInt + 10);

}
const createUser = async (tg_id, tg_name) => {
    //let link = crypto.randomBytes(5).toString("hex");
    // const salt = process.env.LINK_SALT.toString();
    //console.log(`Salt: ${salt}`)
    let link = genLink(tg_id)


    const user = User.build({
        tg_id,
        tg_name,
        link
    });
    await user.save();
    return user;
}

User.hasOne(User, { foreignKey: "talking_to" });
User.belongsToMany(User, { as: "blocked", foreignKey: "blocked_id", through: "blocks" });
User.belongsToMany(User, { as: "blocker", foreignKey: "blocker_id", through: "blocks" })

Db.authenticate()

    .then(() => Db.sync({ force: true }))


    .catch(e => console.error(`Error ${e}`))

module.exports = {
    User,
    createUser,
    setUSerStateVal2,
    setUserState,
    setUserStateVal
}
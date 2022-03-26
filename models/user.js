const Db = require("./db");
const { NumberToAlphabet } = require('number-to-alphabet');

const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;
const { getRandomInt,  reportToAdmin } = require("../utils")
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

// const Block = Db.define("blocks", {
//   blocked_id : {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//   },

// },
// {

// });
User.hasOne(User, { foreignKey: "talking_to" });
User.belongsToMany(User, { as: "blocked", foreignKey: "blocked_id", through: "blocks" });
User.belongsToMany(User, { as: "blocker", foreignKey: "blocker_id", through: "blocks" });
const getUserBlocks = async (userId) => {
    let user = await User.findOne({ where: { tg_id: userId }, include: { model: User, as: 'blocked' } });;
    if (!user) user = await createUser(userId);
    const blocks = [];
    if (!user.blocked) return [];
    reportToAdmin("blckk:" + JSON.stringify(user.blocked))
    user.blocked

        .forEach((element) => {
            blocks.push({ tg_id: element.tg_id, tg_name: element.tg_name, link: element.link })
        })
    reportToAdmin("Blocks " + JSON.stringify(blocks))
    return blocks;
}


const setUserState = async (userId, state) => {
    let user = await User.findOne({ where: { tg_id: userId } });
    if (!user) {
        user = await createUser(userId, "Anon" + getRandomInt(1,100));
    };
  //  reportToAdmin(`state.of(${user.tg_id}) = ${state}`)
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
    //reportToAdmin(`state.of(${user.tg_id}) = ${user.state}`)
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
    const defaultAlphabet = new NumberToAlphabet();
    return defaultAlphabet.numberToString(tgId); 

}
const createUser = async (tg_id, tg_name = undefined) => {
    //let link = crypto.randomBytes(5).toString("hex");
    // const salt = process.env.LINK_SALT.toString();
    //console.log(`Salt: ${salt}`)
    let link = genLink(tg_id)
    
    const tempId = "Anon "+ getRandomInt(1, 1000);

    reportToAdmin(`Temporary id ${tempId}`);
    tg_name = tg_name || tempId;
    const user = User.build({
        tg_id,
        tg_name,
        link
    });
    await user.save();
    return user;
}


Db.authenticate()

    .then(() => Db.sync({ alter:true }))


    .catch(e => console.error(`Error ${e}`))

module.exports = {
    User,
    createUser,
    setUSerStateVal2,
    setUserState,
    setUserStateVal,
    getUserBlocks
}
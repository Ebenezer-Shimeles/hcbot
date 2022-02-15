const Db = require("./db");


const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;
const DotEnv = require("dotenv");
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
        unique: true
    }

}, {
    freezeTablename: true,
    paranoid: true
}
);


User.hasOne(User, { foreignKey: "talking_to" });
User.belongsToMany(User, { as: "blocked", foreignKey: "blocked_id", through: "blocks" });
User.belongsToMany(User, { as: "blocker", foreignKey: "blocker_id", through: "blocks" })

Db.authenticate()

    .then(() => Db.sync({ force: true }))


    .catch(e => console.error(`Error ${e}`))

module.exports = {
    User,

}
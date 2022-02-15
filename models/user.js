const Sequelize = require("sequelize");
const {DataTypes} = Sequelize;

const Db = new Sequelize("HCBOT", "root", "muzebelahu",{
    host: "localhost",
    dialect: "mysql",
});

const User = Db.define("users", {
    tg_id:{
        unique: true,
        allowNull: false,
        type : DataTypes.INTEGER
    },
    tg_name:{
        type: DataTypes.String
    },

},{
    freezeTablename: true,
    paranoid: true
}
);


User.hasOne(User, {foreignKey: "talking_to"});
User.hasMany(User, {through: "blocks"})

Db.authenticate()

.then (() => Db.sync())


.catch(e => console.log(`Error ${e}`))
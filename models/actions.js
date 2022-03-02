const Sequelize = require("sequelize");

const DB = require("./db");


const Actions = DB.define("actions", {
    action: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    }
},
    { freezeTablename: true }
)

//Actions.sync({ alter: true });
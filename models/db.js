const DotEnv = require("dotenv");
const Sequelize = require("sequelize");

DotEnv.config();

const vars = process.env;
const DB = new Sequelize(vars.DB_NAME, vars.DB_USER, vars.DB_PASS, {
    // host: "localhost",
    dialect: "mysql",
});

module.exports = DB;
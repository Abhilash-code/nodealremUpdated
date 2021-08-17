const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
    dialect: dbConfig.dialect,
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        idle: dbConfig.pool.idle,
        acquire: dbConfig.pool.acquire
    }
});

const db = {};


db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.csrUsers = require("./csrUsers.model.js")(sequelize, Sequelize);

db.examDetails = require("./examDetails.model.js")(sequelize, Sequelize);

db.csrReports = require("./csrReports.model.js")(sequelize, Sequelize);

db.csr_formsStat = require("./csr_formsStatus.model.js")(sequelize, Sequelize);
db.ReportSign = require("./ReportSign.model.js")(sequelize, Sequelize);
db.nodelFormDetails = require("./nodelReport.model")(sequelize, Sequelize);

module.exports = db;

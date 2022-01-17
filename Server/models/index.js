const config = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,
        define: {
            timestamps: false
        },
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/user.model.js")(sequelize, Sequelize);
db.notes = require("../models/note.model.js")(sequelize, Sequelize);
db.refreshTokens = require("../models/refreshToken.model.js")(sequelize, Sequelize);

db.users.hasMany(db.notes, { as: "notes" });
db.users.hasMany(db.refreshTokens, { as: "refreshTokens" })

db.notes.belognsTo(db.users, {
    foreignKey: "userId",
    as: "user"
});

db.refreshTokens.belognsTo(db.users, {
    foreignKey: "userId",
    as: "user"
});

module.exports = db;


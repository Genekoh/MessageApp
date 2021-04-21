require("dotenv").config();

const Sequelize = require("sequelize");

console.log(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    process.env.DATABASE_HOST,
    process.env.DATABASE_PORT,
);

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: "postgres",
        dialectOptions: {
            ssl: process.env.DATABASE_SSL ? true : false,
        },
    },
);

module.exports = sequelize;

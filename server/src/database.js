require("dotenv").config();

const Sequelize = require("sequelize");
console.log(process.env.DATABASE_URL);

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: "postgres",
        dialectOptions: {
            ssl: true,
        },
    },
);

module.exports = sequelize;

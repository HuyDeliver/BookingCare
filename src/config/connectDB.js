const { Sequelize } = require('sequelize');
require('dotenv').config();


// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
    process.env.DB_DATABASE_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        dialectOptions:
            process.env.DB_SSL === 'true' ?
                {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                } : {}
        ,
        query: {
            "raw": true
        },
        timezone: "+07:00",
        pool: {
            max: 20,         // số kết nối tối đa
            min: 0,          // số kết nối tối thiểu
            acquire: 30000,  // thời gian chờ tối đa để lấy connection
            idle: 10000      // thời gian connection rảnh trước khi bị release
        }
    });

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
module.exports = connectDB;

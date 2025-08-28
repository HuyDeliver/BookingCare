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
        dialectOptions: {
            ...(process.env.DB_SSL === 'true' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {}),
            // Thêm cấu hình để ưu tiên IPv4
            family: 4,
            keepAlive: true,
            keepAliveInitialDelayMillis: 0,
        },
        query: {
            "raw": true
        },
        timezone: "+07:00",
        pool: {
            max: 20,         // số kết nối tối đa
            min: 0,          // số kết nối tối thiểu
            acquire: 60000,  // thời gian chờ tối đa để lấy connection
            idle: 10000,
            evict: 1000,     // thời gian check connection dead
            handleDisconnects: true    // thời gian connection rảnh trước khi bị release
        },
        retry: {
            match: [
                /ETIMEDOUT/,
                /EHOSTUNREACH/,
                /ECONNRESET/,
                /ECONNREFUSED/,
                /ETIMEDOUT/,
                /ESOCKETTIMEDOUT/,
                /EHOSTUNREACH/,
                /EPIPE/,
                /EAI_AGAIN/,
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/,
                /ENETUNREACH/
            ],
            max: 5
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

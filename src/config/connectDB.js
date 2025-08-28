const { Sequelize } = require('sequelize');
require('dotenv').config();

const dns = require('dns');
// Option 2: Passing parameters separately (other dialects)
dns.setDefaultResultOrder('ipv4first');

// CÁCH 1: Sử dụng connection string (KHUYÊN DÙNG)
const sequelize = new Sequelize(process.env.DB_URL, {
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
        connectTimeout: 60000,
        socketTimeout: 60000,
    },
    query: {
        "raw": true
    },
    timezone: "+07:00",
    pool: {
        max: 5,          // Giảm xuống 5
        min: 0,
        acquire: 60000,
        idle: 10000,
        evict: 1000,
        handleDisconnects: true
    },
    retry: {
        match: [
            /ETIMEDOUT/,
            /EHOSTUNREACH/,
            /ECONNRESET/,
            /ECONNREFUSED/,
            /ESOCKETTIMEDOUT/,
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
        max: 3
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

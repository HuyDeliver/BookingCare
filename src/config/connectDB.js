const { Sequelize } = require('sequelize');
const dns = require('dns').promises;
require('dotenv').config();

async function getOptimalHost() {
    try {
        // Thử resolve IPv4 trước
        const addresses = await dns.resolve4(process.env.DB_HOST);
        console.log('DNS resolved successfully:', addresses[0]);
        return addresses[0];
    } catch (error) {
        console.warn('DNS resolution failed, using original hostname:', error.message);
        // Fallback về hostname gốc
        return process.env.DB_HOST;
    }
}

async function connectDB() {
    try {
        const host = await getOptimalHost();

        const sequelize = new Sequelize(
            process.env.DB_DATABASE_NAME,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            {
                host: host,
                port: process.env.DB_PORT || 5432,
                dialect: 'postgres',
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    },
                },
                timezone: '+07:00',
                logging: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 60000,
                    idle: 10000,
                },
                retry: {
                    match: [
                        /ETIMEDOUT/,
                        /EHOSTUNREACH/,
                        /ECONNRESET/,
                        /ECONNREFUSED/,
                        /ENOTFOUND/,
                        /ENODATA/,
                    ],
                    max: 3
                }
            }
        );

        await sequelize.authenticate();
        console.log('Database connection established successfully via:', host);
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        throw error;
    }
}

module.exports = connectDB;
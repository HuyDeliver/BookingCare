const { Sequelize } = require('sequelize');
const dns = require('dns').promises;
require('dotenv').config();

async function connectDB() {
    try {
        // Resolve IPv4 cho host Supabase
        const addresses = await dns.resolve4(process.env.DB_HOST);
        const ipv4Host = addresses[0];

        const sequelize = new Sequelize(
            process.env.DB_DATABASE_NAME,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            {
                host: ipv4Host,
                port: process.env.DB_PORT,
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
            }
        );

        await sequelize.authenticate();
        console.log('Connection has been established successfully via IPv4:', ipv4Host);
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    define: {
      freezeTableName: true,
    },
    dialectOptions: {
      ...(process.env.DB_SSL === 'true'
        ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
        : {}),
    },
    timezone: '+07:00',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    define: {
      freezeTableName: true,
    },
    dialectOptions: {
      ...(process.env.DB_SSL === 'true'
        ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
        : {}),
    },
    timezone: '+07:00',
    logging: false,
  },
};

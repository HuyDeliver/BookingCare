// config/config.js - FIXED VERSION
require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": "postgres", // Hard-coded thay vì process.env.DB_DIALECT
    "define": {
      "freezeTableName": true
    },
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
    "timezone": "+07:00"
  },

  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": "postgres"
  },

  "production": {
    // Sử dụng connection string hoặc individual params
    "use_env_variable": "DB_URL", // Nếu có DB_URL
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": "postgres",
    "define": {
      "freezeTableName": true
    },
    dialectOptions: {
      ...(process.env.DB_SSL === 'true' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}),
      // IPv4 configuration
      family: 4,
      keepAlive: true,
      keepAliveInitialDelayMillis: 0,
      connectTimeout: 60000,
      socketTimeout: 60000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
      evict: 1000,
      handleDisconnects: true
    },
    "timezone": "+07:00"
  }
};
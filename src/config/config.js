require('dotenv').config();

async function getDatabaseConfig() {
  const dns = require('dns').promises;

  let host = process.env.DB_HOST;
  try {
    const addresses = await dns.resolve4(host);
    host = addresses[0];
    console.log('Config using resolved IP:', host);
  } catch (error) {
    console.warn('Config using original hostname due to DNS error');
  }

  const baseConfig = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: host,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    define: {
      freezeTableName: true,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    timezone: '+07:00',
    logging: false,
  };

  return {
    development: baseConfig,
    production: baseConfig,
  };
}

module.exports = getDatabaseConfig();
// connectDB.js - SUPAVISOR SOLUTION
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Force IPv4 first for Node.js
process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';

const connectDB = async () => {
    try {
        console.log('=== Supavisor Connection ===');

        // SỬ DỤNG TRANSACTION POOLER (IPv4 Compatible)
        // Copy từ Supabase Dashboard như trong hình
        const connectionString = process.env.TRANSACTION_POOLER_URL || process.env.DB_URL;

        if (!connectionString) {
            throw new Error('SUPAVISOR_URL or DB_URL is required');
        }

        console.log('Using Transaction Pooler (IPv4 Compatible)');
        console.log('Connection format: postgresql://postgres.xxx:***@aws-1-us-east-2.pooler.supabase.com:5432/postgres');

        const sequelize = new Sequelize(connectionString, {
            dialect: 'postgres',
            logging: false, // Set to console.log for debugging
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                },
                // Network settings for better compatibility
                keepAlive: true,
                keepAliveInitialDelayMillis: 0,
                connectTimeout: 30000,
                socketTimeout: 30000,
                // Try both IPv4 and IPv6, but prefer IPv4
                family: 0, // 0 = auto, 4 = IPv4 only, 6 = IPv6 only
            },
            pool: {
                max: 5,      // Reduced for connection pooler
                min: 0,
                acquire: 30000,
                idle: 10000,
                evict: 1000,
                handleDisconnects: true
            },
            query: {
                raw: true
            },
            timezone: '+07:00',
            retry: {
                match: [
                    /ETIMEDOUT/,
                    /EHOSTUNREACH/,
                    /ECONNRESET/,
                    /ECONNREFUSED/,
                    /ESOCKETTIMEDOUT/,
                    /EPIPE/,
                    /EAI_AGAIN/,
                    /ENETUNREACH/,
                    /SequelizeConnectionError/,
                    /SequelizeConnectionRefusedError/,
                    /SequelizeHostNotFoundError/,
                    /SequelizeHostNotReachableError/,
                    /SequelizeInvalidConnectionError/,
                    /SequelizeConnectionTimedOutError/
                ],
                max: 3
            }
        });

        console.log('Testing Supavisor connection...');
        await sequelize.authenticate();
        console.log('✅ Connected via Supavisor successfully!');

        // Test query
        const [results] = await sequelize.query('SELECT NOW() as current_time, version() as pg_version');
        console.log('📅 Database time:', results[0].current_time);
        console.log('🐘 PostgreSQL version:', results[0].pg_version.split(' ')[0]);

        global.sequelize = sequelize;
        return sequelize;

    } catch (error) {
        console.error('❌ Supavisor connection failed:');
        console.error('Error:', error.message);
        console.error('Code:', error.code);

        if (error.code === 'ENETUNREACH') {
            console.error('🔧 Still IPv6 issue. Try these:');
            console.error('   1. Get Supavisor URL from Dashboard');
            console.error('   2. Enable IPv4 add-on ($4/month)');
            console.error('   3. Use Supabase client library instead');
        }

        // Retry logic for production
        if (process.env.NODE_ENV === 'production') {
            console.log('🔄 Retrying in 15 seconds...');
            setTimeout(connectDB, 15000);
        } else {
            throw error;
        }
    }
};

module.exports = connectDB;
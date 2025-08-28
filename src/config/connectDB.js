// connectDB.js - SINGLE CONNECTION APPROACH
const { Sequelize } = require('sequelize');
const dns = require('dns');
require('dotenv').config();

// Force IPv4 DNS resolution globally
dns.setDefaultResultOrder('ipv4first');

// Manual IPv4 hostname resolution
const resolveToIPv4 = (hostname) => {
    return new Promise((resolve) => {
        dns.resolve4(hostname, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                console.log(`Failed to resolve ${hostname} to IPv4, using original hostname`);
                resolve(hostname);
            } else {
                console.log(`Resolved ${hostname} to IPv4: ${addresses[0]}`);
                resolve(addresses[0]);
            }
        });
    });
};

// Parse connection string and replace hostname with IPv4
const parseAndResolveConnectionString = async (connectionString) => {
    try {
        const url = new URL(connectionString);
        const originalHost = url.hostname;

        console.log(`Original hostname: ${originalHost}`);

        // Resolve to IPv4
        const ipv4Host = await resolveToIPv4(originalHost);

        // Replace hostname with IPv4 address
        url.hostname = ipv4Host;

        const newConnectionString = url.toString();
        console.log(`Modified connection string: ${newConnectionString.replace(/:([^:@]+)@/, ':***@')}`);

        return newConnectionString;
    } catch (error) {
        console.log('Failed to parse connection string, using original:', error.message);
        return connectionString;
    }
};

let sequelizeInstance = null;

const connectDB = async () => {
    // Return existing instance if already connected
    if (sequelizeInstance) {
        try {
            await sequelizeInstance.authenticate();
            console.log('✅ Using existing connection');
            return sequelizeInstance;
        } catch (error) {
            console.log('Existing connection failed, creating new one');
            sequelizeInstance = null;
        }
    }

    try {
        console.log('=== Single Connection Approach ===');

        const originalConnectionString = process.env.TRANSACTION_POOLER_URL || process.env.DB_URL;

        if (!originalConnectionString) {
            throw new Error('TRANSACTION_POOLER_URL or DB_URL is required');
        }

        // Resolve hostname to IPv4
        const resolvedConnectionString = await parseAndResolveConnectionString(originalConnectionString);

        sequelizeInstance = new Sequelize(resolvedConnectionString, {
            dialect: 'postgres',
            logging: false, // Set to console.log for debugging

            // DISABLE CONNECTION POOLING - Use single persistent connection
            pool: {
                max: 1,      // Only 1 connection
                min: 1,      // Always keep 1 connection
                acquire: 60000,
                idle: 300000, // Keep connection alive for 5 minutes
                evict: 10000,
                handleDisconnects: true
            },

            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                },
                // Network configuration
                keepAlive: true,
                keepAliveInitialDelayMillis: 10000,
                connectTimeout: 30000,
                socketTimeout: 30000,
                // Force IPv4 at socket level
                family: 4,
            },

            // Connection handling
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
                    /SequelizeConnectionError/
                ],
                max: 2 // Reduced retry attempts
            },

            query: {
                raw: true
            },
            timezone: '+07:00',

            // Important: Define connection handling
            define: {
                freezeTableName: true,
                timestamps: true
            }
        });

        console.log('Testing single connection...');
        await sequelizeInstance.authenticate();
        console.log('✅ Single connection established successfully!');

        // Test with a simple query
        const [results] = await sequelizeInstance.query('SELECT NOW() as current_time, current_database() as db_name');
        console.log('📅 Database time:', results[0].current_time);
        console.log('🏛️  Database name:', results[0].db_name);

        // Set up connection event handlers
        sequelizeInstance.connectionManager.on('connect', () => {
            console.log('🔗 Database connection established');
        });

        sequelizeInstance.connectionManager.on('disconnect', () => {
            console.log('🔌 Database connection lost');
        });

        global.sequelize = sequelizeInstance;
        return sequelizeInstance;

    } catch (error) {
        console.error('❌ Single connection failed:');
        console.error('Error:', error.message);
        console.error('Code:', error.code);

        // Reset instance on failure
        sequelizeInstance = null;

        if (error.code === 'ENETUNREACH') {
            console.error('🔧 IPv6 issue persists. Next steps:');
            console.error('   1. Contact Render support about IPv6 routing');
            console.error('   2. Try Supabase IPv4 add-on ($4/month)');
            console.error('   3. Use Supabase client library instead');
        }

        // Don't retry in production to avoid infinite loops
        if (process.env.NODE_ENV !== 'production') {
            throw error;
        } else {
            console.log('Production mode: not retrying to avoid loops');
            return null;
        }
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    if (sequelizeInstance) {
        console.log('Closing database connection...');
        await sequelizeInstance.close();
    }
});

process.on('SIGINT', async () => {
    if (sequelizeInstance) {
        console.log('Closing database connection...');
        await sequelizeInstance.close();
    }
    process.exit(0);
});

module.exports = connectDB;
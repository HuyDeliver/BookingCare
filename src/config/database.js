
const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('hoidanit', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3307,
});

let connectTest = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectTest

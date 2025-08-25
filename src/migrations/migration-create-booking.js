'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Bookings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            statusID: {
                type: Sequelize.STRING
            },
            doctorID: {
                type: Sequelize.INTEGER
            },
            patientID: {
                type: Sequelize.INTEGER
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            birthday: {
                allowNull: false,
                type: Sequelize.DATEONLY
            },
            timeType: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            reason: {
                type: Sequelize.TEXT('long'),
                allowNull: false
            },
            token: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Bookings')
    }
};
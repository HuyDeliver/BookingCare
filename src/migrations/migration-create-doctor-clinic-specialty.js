'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Doctor_Clinic_Specialty', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            doctorId: {
                type: Sequelize.INTEGER
            },
            clinicID: {
                type: Sequelize.INTEGER
            },
            specialtyID: {
                type: Sequelize.INTEGER
            },
            createdAT: {
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
        await queryInterface.dropTable('Doctor_Clinic_Specialty')
    }
};
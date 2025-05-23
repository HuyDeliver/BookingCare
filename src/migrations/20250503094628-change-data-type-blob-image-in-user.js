'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'image', {
      type: Sequelize.BLOB('long'),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};


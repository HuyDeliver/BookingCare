'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'gender', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'gender', {
      type: Sequelize.BOOLEAN,
    });
  }
};

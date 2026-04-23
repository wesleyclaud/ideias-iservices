'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      user_id: { type: Sequelize.UUID, allowNull: true },
      action: { type: Sequelize.STRING(100), allowNull: false },
      entity: { type: Sequelize.STRING(100), allowNull: true },
      entity_id: { type: Sequelize.STRING(100), allowNull: true },
      details: { type: Sequelize.JSON, allowNull: true },
      ip: { type: Sequelize.STRING(50), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('audit_logs');
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('documents', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      title: { type: Sequelize.STRING(200), allowNull: false },
      type: { type: Sequelize.STRING(100), allowNull: false },
      file_url: { type: Sequelize.STRING(500), allowNull: true },
      expiry_date: { type: Sequelize.DATEONLY, allowNull: true },
      status: {
        type: Sequelize.ENUM('vigente', 'a_vencer', 'vencido'),
        defaultValue: 'vigente',
        allowNull: false,
      },
      linked_entity: { type: Sequelize.STRING(100), allowNull: true },
      linked_id: { type: Sequelize.STRING(100), allowNull: true },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('documents');
  },
};

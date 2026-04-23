'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('service_orders', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      title: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM('pendente', 'em_andamento', 'executada', 'qualificada', 'faturada'),
        defaultValue: 'pendente',
        allowNull: false,
      },
      priority: {
        type: Sequelize.ENUM('baixa', 'media', 'alta', 'urgente'),
        defaultValue: 'media',
        allowNull: false,
      },
      assigned_to: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      scheduled_at: { type: Sequelize.DATE, allowNull: true },
      completed_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('service_orders');
  },
};

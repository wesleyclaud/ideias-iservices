'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('routes', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      title: { type: Sequelize.STRING(200), allowNull: false },
      origin: { type: Sequelize.STRING(300), allowNull: false },
      destination: { type: Sequelize.STRING(300), allowNull: false },
      driver_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
      vehicle_plate: { type: Sequelize.STRING(20), allowNull: true },
      status: {
        type: Sequelize.ENUM('planejada', 'em_andamento', 'concluida', 'cancelada'),
        defaultValue: 'planejada',
        allowNull: false,
      },
      scheduled_at: { type: Sequelize.DATE, allowNull: true },
      completed_at: { type: Sequelize.DATE, allowNull: true },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('routes');
  },
};

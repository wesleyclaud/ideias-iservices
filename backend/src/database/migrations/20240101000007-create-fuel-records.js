'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fuel_records', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      vehicle_plate: { type: Sequelize.STRING(20), allowNull: false },
      driver_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      liters: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      cost_per_liter: { type: Sequelize.DECIMAL(10, 4), allowNull: false },
      total_cost: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      odometer: { type: Sequelize.INTEGER, allowNull: true },
      fueled_at: { type: Sequelize.DATE, allowNull: false },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('fuel_records');
  },
};

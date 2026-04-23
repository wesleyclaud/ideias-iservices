const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FuelRecord = sequelize.define('FuelRecord', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  vehiclePlate: { type: DataTypes.STRING(20), allowNull: false },
  driverId: { type: DataTypes.UUID, allowNull: false },
  liters: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  costPerLiter: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
  totalCost: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  odometer: { type: DataTypes.INTEGER, allowNull: true },
  fueledAt: { type: DataTypes.DATE, allowNull: false },
  createdBy: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'fuel_records', underscored: true });

module.exports = FuelRecord;

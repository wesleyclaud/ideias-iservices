const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Route = sequelize.define('Route', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  origin: { type: DataTypes.STRING(300), allowNull: false },
  destination: { type: DataTypes.STRING(300), allowNull: false },
  driverId: { type: DataTypes.UUID, allowNull: true },
  vehiclePlate: { type: DataTypes.STRING(20), allowNull: true },
  status: {
    type: DataTypes.ENUM('planejada', 'em_andamento', 'concluida', 'cancelada'),
    defaultValue: 'planejada',
    allowNull: false,
  },
  scheduledAt: { type: DataTypes.DATE, allowNull: true },
  completedAt: { type: DataTypes.DATE, allowNull: true },
  createdBy: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'routes', underscored: true });

module.exports = Route;

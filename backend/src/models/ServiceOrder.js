const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ServiceOrder = sequelize.define('ServiceOrder', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('pendente', 'em_andamento', 'executada', 'qualificada', 'faturada'),
    defaultValue: 'pendente',
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('baixa', 'media', 'alta', 'urgente'),
    defaultValue: 'media',
    allowNull: false,
  },
  assignedTo: { type: DataTypes.UUID, allowNull: true },
  createdBy: { type: DataTypes.UUID, allowNull: false },
  scheduledAt: { type: DataTypes.DATE, allowNull: true },
  completedAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'service_orders', underscored: true });

module.exports = ServiceOrder;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Contract = sequelize.define('Contract', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  clientName: { type: DataTypes.STRING(200), allowNull: false },
  value: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY, allowNull: false },
  status: {
    type: DataTypes.ENUM('ativo', 'encerrado', 'suspenso'),
    defaultValue: 'ativo',
    allowNull: false,
  },
  documentUrl: { type: DataTypes.STRING(500), allowNull: true },
  createdBy: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'contracts', underscored: true });

module.exports = Contract;

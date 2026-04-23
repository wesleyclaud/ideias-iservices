const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: true },
  action: { type: DataTypes.STRING(100), allowNull: false },
  entity: { type: DataTypes.STRING(100), allowNull: true },
  entityId: { type: DataTypes.STRING(100), allowNull: true },
  details: { type: DataTypes.JSON, allowNull: true },
  ip: { type: DataTypes.STRING(50), allowNull: true },
}, { tableName: 'audit_logs', underscored: true, updatedAt: false });

module.exports = AuditLog;

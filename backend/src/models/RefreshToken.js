const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const RefreshToken = sequelize.define('RefreshToken', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  tokenHash: { type: DataTypes.STRING(512), allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
}, { tableName: 'refresh_tokens', underscored: true, updatedAt: false });

module.exports = RefreshToken;

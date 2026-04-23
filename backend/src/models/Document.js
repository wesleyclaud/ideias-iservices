const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Document = sequelize.define('Document', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  type: { type: DataTypes.STRING(100), allowNull: false },
  fileUrl: { type: DataTypes.STRING(500), allowNull: true },
  expiryDate: { type: DataTypes.DATEONLY, allowNull: true },
  status: {
    type: DataTypes.ENUM('vigente', 'a_vencer', 'vencido'),
    defaultValue: 'vigente',
    allowNull: false,
  },
  linkedEntity: { type: DataTypes.STRING(100), allowNull: true },
  linkedId: { type: DataTypes.STRING(100), allowNull: true },
  createdBy: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'documents', underscored: true });

module.exports = Document;

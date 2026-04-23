const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Prospect = sequelize.define('Prospect', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  companyName: { type: DataTypes.STRING(200), allowNull: false },
  contactName: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: true },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('novo', 'contatado', 'qualificado', 'convertido'),
    defaultValue: 'novo',
    allowNull: false,
  },
  createdBy: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'prospects', underscored: true });

module.exports = Prospect;

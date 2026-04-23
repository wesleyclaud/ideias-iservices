const sequelize = require('../config/sequelize');

const User = require('./User');
const RefreshToken = require('./RefreshToken');
const AuditLog = require('./AuditLog');
const ServiceOrder = require('./ServiceOrder');
const Contract = require('./Contract');
const Document = require('./Document');
const FuelRecord = require('./FuelRecord');
const Route = require('./Route');
const Prospect = require('./Prospect');

// Associations
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(ServiceOrder, { foreignKey: 'assignedTo', as: 'assignedOrders' });
User.hasMany(ServiceOrder, { foreignKey: 'createdBy', as: 'createdOrders' });
ServiceOrder.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
ServiceOrder.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(FuelRecord, { foreignKey: 'driverId', as: 'fuelRecords' });
FuelRecord.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

User.hasMany(Route, { foreignKey: 'driverId', as: 'routes' });
Route.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

module.exports = {
  sequelize,
  User,
  RefreshToken,
  AuditLog,
  ServiceOrder,
  Contract,
  Document,
  FuelRecord,
  Route,
  Prospect,
};

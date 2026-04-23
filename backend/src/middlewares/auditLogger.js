const { AuditLog } = require('../models');

const auditLogger = async (userId, action, entity, entityId, details, ip) => {
  try {
    await AuditLog.create({ userId, action, entity, entityId, details, ip });
  } catch (e) {
    // silent
  }
};

module.exports = auditLogger;

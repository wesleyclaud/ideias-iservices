module.exports = {
  secret: process.env.JWT_SECRET || 'dev_secret_change_in_production_32chars!!',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret_change_in_prod_32chars!!',
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
};

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

if (!secret || !refreshSecret) {
  throw new Error('JWT_SECRET e REFRESH_TOKEN_SECRET devem estar definidos no .env');
}

module.exports = {
  secret,
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshSecret,
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
};

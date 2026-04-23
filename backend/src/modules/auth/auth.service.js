const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, RefreshToken } = require('../../models');
const jwtConfig = require('../../config/jwt');
const auditLogger = require('../../middlewares/auditLogger');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
  const accessToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  const refreshToken = jwt.sign({ id: user.id }, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
  return { accessToken, refreshToken };
};

const login = async (email, password, ip) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 401, message: 'Credenciais inválidas.' };
  if (!user.isActive) throw { status: 401, message: 'Conta inativa. Contate o administrador.' };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw { status: 401, message: 'Credenciais inválidas.' };

  const { accessToken, refreshToken } = generateTokens(user);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });

  await user.update({ lastLogin: new Date() });
  await auditLogger(user.id, 'LOGIN', 'user', user.id, null, ip);

  return { accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl } };
};

const refresh = async (rawToken) => {
  if (!rawToken) throw { status: 401, message: 'Refresh token não fornecido.' };

  let payload;
  try {
    payload = jwt.verify(rawToken, jwtConfig.refreshSecret);
  } catch {
    throw { status: 401, message: 'Refresh token inválido ou expirado.' };
  }

  const tokenHash = hashToken(rawToken);
  const stored = await RefreshToken.findOne({ where: { userId: payload.id, tokenHash } });
  if (!stored || new Date() > stored.expiresAt) throw { status: 401, message: 'Sessão expirada.' };

  const user = await User.findByPk(payload.id);
  if (!user || !user.isActive) throw { status: 401, message: 'Usuário inativo.' };

  await stored.destroy();

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({ userId: user.id, tokenHash: hashToken(newRefreshToken), expiresAt });

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (rawToken, userId, ip) => {
  if (rawToken) {
    const tokenHash = hashToken(rawToken);
    await RefreshToken.destroy({ where: { tokenHash } });
  }
  await auditLogger(userId, 'LOGOUT', 'user', userId, null, ip);
};

module.exports = { login, refresh, logout };

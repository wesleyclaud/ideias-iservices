const { validationResult } = require('express-validator');
const authService = require('./auth.service');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const ip = req.ip;
    const { accessToken, refreshToken, user } = await authService.login(email, password, ip);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
    return res.json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const rawToken = req.cookies?.refreshToken;
    const { accessToken, refreshToken } = await authService.refresh(rawToken);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const rawToken = req.cookies?.refreshToken;
    await authService.logout(rawToken, req.user?.id, req.ip);

    res.clearCookie('refreshToken');
    return res.json({ message: 'Logout realizado com sucesso.' });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  return res.json({ user: req.user });
};

module.exports = { login, refresh, logout, me };

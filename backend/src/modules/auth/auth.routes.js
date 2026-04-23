const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const controller = require('./auth.controller');
const authenticate = require('../../middlewares/authenticate');

const router = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas. Aguarde 1 minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginValidation = [
  body('email').isEmail().withMessage('E-mail inválido.'),
  body('password').isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres.'),
];

router.post('/login', authLimiter, loginValidation, controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.me);

module.exports = router;

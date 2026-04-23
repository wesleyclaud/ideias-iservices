const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('./users.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = Router();
router.use(authenticate);

router.get('/', authorize('admin', 'gestor'), controller.list);
router.get('/:id', authorize('admin', 'gestor'), controller.getOne);
router.post('/', authorize('admin'), [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['admin', 'gestor', 'coordenador', 'tecnico', 'financeiro']),
], controller.create);
router.put('/:id', authorize('admin'), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);

module.exports = router;

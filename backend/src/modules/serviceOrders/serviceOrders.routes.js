const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('./serviceOrders.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = Router();
router.use(authenticate);

router.get('/counts', controller.counts);
router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', authorize('admin', 'gestor', 'coordenador'), [
  body('title').notEmpty().withMessage('Título obrigatório.'),
], controller.create);
router.put('/:id', authorize('admin', 'gestor', 'coordenador', 'tecnico'), controller.update);

module.exports = router;

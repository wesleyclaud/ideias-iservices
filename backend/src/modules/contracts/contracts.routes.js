const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('./contracts.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = Router();
router.use(authenticate);

router.get('/counts', controller.counts);
router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', authorize('admin', 'gestor', 'financeiro'), [
  body('title').notEmpty(),
  body('clientName').notEmpty(),
  body('value').isNumeric(),
  body('startDate').isDate(),
  body('endDate').isDate(),
], controller.create);
router.put('/:id', authorize('admin', 'gestor', 'financeiro'), controller.update);

module.exports = router;

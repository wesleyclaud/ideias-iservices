const { Router } = require('express');
const controller = require('./fuel.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = Router();
router.use(authenticate);

router.get('/', controller.list);
router.post('/', authorize('admin', 'gestor', 'coordenador'), controller.create);

module.exports = router;

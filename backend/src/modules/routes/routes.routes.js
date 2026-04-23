const { Router } = require('express');
const controller = require('./routes.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = Router();
router.use(authenticate);

router.get('/', controller.list);
router.post('/', authorize('admin', 'gestor', 'coordenador'), controller.create);
router.put('/:id', authorize('admin', 'gestor', 'coordenador'), controller.update);

module.exports = router;

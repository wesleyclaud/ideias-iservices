const { Router } = require('express');
const controller = require('./documents.controller');
const authenticate = require('../../middlewares/authenticate');

const router = Router();
router.use(authenticate);

router.get('/counts', controller.counts);
router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);

module.exports = router;

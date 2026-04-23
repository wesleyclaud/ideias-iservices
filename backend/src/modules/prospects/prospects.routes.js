const { Router } = require('express');
const controller = require('./prospects.controller');
const authenticate = require('../../middlewares/authenticate');

const router = Router();
router.use(authenticate);

router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);

module.exports = router;

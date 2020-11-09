const router = require('express').Router();

const user = require('../controllers/user');

// start line Login
router.get('/', user.login);
router.post('/', user.verify);

router.use('/cb', user.lineCb);

module.exports = router;

const router = require('express').Router();

const user = require('./user');
const shop = require('./shop');

router.get('/', (req, res) => res.send('server allive'));

router.use('/login', user);
router.use('/shop', shop);

module.exports = router;

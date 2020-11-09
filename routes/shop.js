const router = require('express').Router();

const shop = require('../controllers/shop');
const linelogin = require('./../utils/line')

//router.use('/', linelogin.checkCookie);

router.get('/', shop.read);
router.post('/', shop.create);
router.put('/', shop.update);
router.delete('/', shop.delete);

module.exports = router;

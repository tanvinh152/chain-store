var express = require('express');
var router = express.Router();
const { MerchandiseController } = require('../controllers');
const { Auth } = require('../middlewares');
const {
    validateGetAllMerchandise,
    validateGetDetailMerchandise,
} = require('../utils/validations');

/* GET users listing. */
router.use(Auth.auth);
router.get(
    '/',
    validateGetAllMerchandise,
    MerchandiseController.getAllMerchandise
);
router.get(
    '/active',
    validateGetAllMerchandise,
    MerchandiseController.getMerchandiseActive
);

router.get(
    '/:id',
    validateGetDetailMerchandise,
    MerchandiseController.getMerchandiseDetail
);
router.use(Auth.admin);

router.put('/:id', MerchandiseController.updateMerchandise);
router.post('/', MerchandiseController.createMerchandise);

module.exports = router;

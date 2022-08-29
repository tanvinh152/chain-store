var express = require('express');
var router = express.Router();
const { HistoryController } = require('../controllers');
const { Auth } = require('../middlewares');

router.use(Auth.auth);
router.get('/', HistoryController.getHistory);

module.exports = router;

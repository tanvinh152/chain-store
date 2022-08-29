var express = require("express");
var router = express.Router();
const { RevenueController } = require("../controllers");
var { Auth } = require("../middlewares");
/* GET users listing. */
router.use(Auth.auth);
router.get("/year/:year", RevenueController.getRevenueYear);
router.get("/today", RevenueController.getRevenueToday);
router.get("/month/:year", RevenueController.getRevenueMonth);
router.get("/year/:year/:store", RevenueController.getRevenueYearOfStore);
router.get("/today/:store", RevenueController.getRevenueTodayOfStore);
router.get("/month/:year/:store", RevenueController.getRevenueMonthOfStore);
module.exports = router;

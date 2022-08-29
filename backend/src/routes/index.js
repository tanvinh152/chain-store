const express = require("express");
const router = express.Router();
const auth = require("./auth.route");
const user = require("./user.route");
const config = require("./config.route");
const calendar = require("./calendar.route");
const store = require("./store.route");
const category = require("./category.route");
const merchandise = require("./merchandise.route");
const warehouse = require("./warehouse.route");
const supplier = require("./supplier.route");
const bill = require("./bill.route");
const revenue = require("./revenue.route");
const history = require("./history.route");

router.use("/auth", auth);
router.use("/user", user);
router.use("/config", config);
router.use("/calendar", calendar);
router.use("/store", store);
router.use("/category", category);
router.use("/merchandise", merchandise);
router.use("/warehouse", warehouse);
router.use("/supplier", supplier);
router.use("/bill", bill);
router.use("/revenue", revenue);
router.use("/history", history);

module.exports = router;

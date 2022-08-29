var express = require("express");
var router = express.Router();
const { WarehouseController } = require("../controllers");
const { Auth } = require("../middlewares");
// const { validateGetWarehouse } = require("../utils/validations");

/* GET users listing. */
router.use(Auth.auth);
router.get("/", WarehouseController.getWarehouse);

router.get("/active", WarehouseController.getWarehouseActive);
router.use(Auth.admin);

router.post("/", WarehouseController.createWarehouse);
router.put("/:id", WarehouseController.updateWarehouse);

module.exports = router;

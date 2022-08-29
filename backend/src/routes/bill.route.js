var express = require("express");
var router = express.Router();
const { BillController } = require("../controllers");
var { Auth } = require("../middlewares");
const {
    validateGetSupplier,
    validateCreateSupplier,
    validateEditSupplierParams,
    validateEditSupplierBody,
} = require("../utils/validations");

/* GET users listing. */
router.use(Auth.auth);
router.get("/:store", BillController.getAllBillOfStore);
router.get("/", BillController.getAllBill);
router.get("/:id", BillController.getDetailBill);
router.delete("/:id", BillController.deleteBill);
router.post("/", BillController.createBill);
module.exports = router;

var express = require("express");
var router = express.Router();
const { SupplierController } = require("../controllers");
var { Auth } = require("../middlewares");
const {
    validateGetSupplier,
    validateCreateSupplier,
    validateEditSupplierParams,
    validateEditSupplierBody,
} = require("../utils/validations");

/* GET users listing. */
router.use(Auth.auth);
router.get("/", validateGetSupplier, SupplierController.getSupplier);
router.get("/active", validateGetSupplier, SupplierController.getSupplierActive);
router.get("/:category", SupplierController.getSupplierWithMerchandise);
router.use(Auth.admin);

router.post("/", validateCreateSupplier, SupplierController.createSupplier);
router.put(
    "/:id",
    [validateEditSupplierParams, validateEditSupplierBody],
    SupplierController.updateSupplier
);
module.exports = router;

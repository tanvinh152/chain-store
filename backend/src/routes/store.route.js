var express = require("express");
var router = express.Router();
const { StoreController } = require("../controllers");
var { Auth } = require("../middlewares");
const {
  validateGetStore,
  validateCreateStore,
  validateDeleteStore,
} = require("../utils/validations");

/* GET users listing. */
router.use(Auth.auth);
router.get("/", validateGetStore, StoreController.getAllStore);
router.get("/active", validateGetStore, StoreController.getStoreActive);
router.get("/:id", StoreController.getDetailStore);

router.use(Auth.admin);
router.post("/", validateCreateStore, StoreController.createStore);
router.put("/:id", validateCreateStore, StoreController.updateStore);
router.delete("/:id", validateDeleteStore, StoreController.deleteStore);

module.exports = router;

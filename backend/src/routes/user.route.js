var express = require("express");
var router = express.Router();
const { UserController } = require("../controllers");
var { Auth } = require("../middlewares");
const {
  validateAuthDeleteUser,
  validateAuthEditUserBody,
  validateAuthEditUserParams,
  validateSetAuthUserBody,
  validateSetAuthUserParams,
} = require("../utils/validations");

/* GET users listing. */
router.use(Auth.auth);
router.get("/me", UserController.me);
router.get("/logout", UserController.logout);
router.put(
  "/:id",
  [validateAuthEditUserParams, validateAuthEditUserBody],
  UserController.editUserDetail
);

router.use(Auth.admin);
router.put(
  "/role/:id",
  [validateSetAuthUserParams, validateSetAuthUserBody],
  UserController.setRole
);
router.get("/:store", UserController.getAllUserOfStore);
router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUserDetail);
router.delete("/:id", validateAuthDeleteUser, UserController.deleteUserDetail);

module.exports = router;

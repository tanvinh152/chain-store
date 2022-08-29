var express = require("express");
var router = express.Router();
const { AuthController } = require("../controllers");
const { Auth } = require("../middlewares");

const {
  validateAuthLogin,
  validateAuthAddUser,
} = require("../utils/validations");

/* GET users listing. */
router.post("/login", validateAuthLogin, AuthController.login);
router.use(Auth.auth);
router.post("/add-user", validateAuthAddUser, AuthController.addUser);

module.exports = router;

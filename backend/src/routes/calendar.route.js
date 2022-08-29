var express = require("express");
var router = express.Router();
const { CalendarController } = require("../controllers");
const { Auth } = require("../middlewares");
const {
  validateGenerateCalendar,
  validateQueryGetCalendar,
  validateRegisterCalendar,
  validateCancelRegisterCalendar,
  validateDeleteSpecificCalendar
} = require("../utils/validations");

router.use(Auth.auth);

router.get("/", validateQueryGetCalendar, CalendarController.getCalendar);
router.post(
  "/register",
  validateRegisterCalendar,
  CalendarController.registerCalendar
);
router.post(
  "/cancel-register",
  validateCancelRegisterCalendar,
  CalendarController.cancelRegisterCalendar
);

router.use(Auth.admin);
router.post(
  "/create",
  validateGenerateCalendar,
  CalendarController.createCalendar
);
router.delete("/:id", validateDeleteSpecificCalendar, CalendarController.deleteSpecificCalendar);

module.exports = router;

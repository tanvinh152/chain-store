var express = require("express");
var router = express.Router();
const { CategoryController } = require("../controllers");
const { Auth } = require("../middlewares");
const {
  validateGetAllCategory,
  validateGetCategoryDetail,
  validateCreateCategory,
  validateUpdateCategory,
  validateDeleteCategory,
} = require("../utils/validations");

router.use(Auth.auth);
router.get("/", validateGetAllCategory, CategoryController.getCategory);
router.get(
  "/:id",
  validateGetCategoryDetail,
  CategoryController.getCategoryDetail
);

router.use(Auth.admin);
router.post("/", validateCreateCategory, CategoryController.createCategory);
router.put(
  "/:id",
  validateUpdateCategory,
  CategoryController.updateCategoryDetail
);
router.delete(
  "/:id",
  validateDeleteCategory,
  CategoryController.deleteCategoryDetail
);

module.exports = router;

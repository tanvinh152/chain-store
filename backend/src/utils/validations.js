const SCHEMAS = require("../validation-schemas");

const validationCheckHandler = (res, next, result) => {
  if (result.error) {
    return res.status(400).json(result.error.details[0]);
  }
  return next();
};

const validateReq = (req, res, next, schema, typeName) => {
  let result;

  // Validating request parameters
  switch (typeName) {
    case "params":
      result = schema.validate(req.params);
      break;
    case "query":
      result = schema.validate(req.query);
      break;
    case "headers":
      result = schema.validate(req.headers);
      break;
    default:
      result = schema.validate(req.body);
      break;
  }

  // Handling response
  validationCheckHandler(res, next, result);
};

//Auth
const validateAuthLogin = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.auth.login, "body");
};

const validateAuthAddUser = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.auth.addUser, "body");
};

const validateAuthDeleteUser = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.auth.deleteUser, "params");
};

const validateAuthEditUserParams = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.auth.editUserParams, "params");
};

const validateAuthEditUserBody = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.auth.editUserBody, "body");
};

const validateSetAuthUserParams = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.auth.setRoleUserParams, "params");
};

const validateSetAuthUserBody = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.auth.setRoleUserBody, "body");
};

//Calendar
const validateGenerateCalendar = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.calendar.createCalendar, "body");
};

const validateQueryGetCalendar = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.calendar.getCalendar, "query");
};

const validateDeleteSpecificCalendar = (req, res, next) => {
  validateReq(
    req,
    res,
    next,
    SCHEMAS.calendar.deleteSpecificCalendar,
    "params"
  );
};

const validateRegisterCalendar = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.calendar.registerCalendar, "body");
};

const validateCancelRegisterCalendar = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.calendar.cancelRegisterCalendar, "body");
};

//Store
const validateGetStore = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.store.getStore, "query");
};

const validateCreateStore = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.store.createStore, "body");
};

const validateDeleteStore = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.store.deleteStore, "params");
};

//Supplier

const validateGetSupplier = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.supplier.getSupplier, "query");
};
const validateCreateSupplier = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.supplier.createSupplier, "body");
};
const validateEditSupplierBody = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.supplier.editSupplierBody, "body");
};
const validateEditSupplierParams = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.supplier.editSupplierParams, "params");
};

//Warehouse
const validateGetWarehouse = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.warehouse.getWarehouse, "headers");
};

//Merchandise
const validateGetAllMerchandise = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.merchandise.getAllMerchandise, "query");
};

const validateGetDetailMerchandise = (req, res, next) => {
  validateReq(
    req,
    res,
    next,
    SCHEMAS.merchandise.getDetailMerchandise,
    "params"
  );
};

//Category
const validateGetAllCategory = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.category.getAllCategory, "query");
};
const validateGetCategoryDetail = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.category.getDetailCategory, "params");
};
const validateCreateCategory = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.category.createCategory, "body");
};
const validateUpdateCategory = (req, res, next) => {
  // validateReq(req, res, next, SCHEMAS.category.updateCategoryParams, "params");
  validateReq(req, res, next, SCHEMAS.category.updateCategory, "body");
};
const validateDeleteCategory = (req, res, next) => {
  validateReq(req, res, next, SCHEMAS.category.deleteCategory, "params");
};

module.exports = {
  validateAuthLogin,
  validateAuthAddUser,
  validateGenerateCalendar,
  validateQueryGetCalendar,
  validateRegisterCalendar,
  validateCancelRegisterCalendar,
  validateGetStore,
  validateCreateStore,
  validateDeleteStore,
  validateDeleteSpecificCalendar,
  validateGetWarehouse,
  validateGetAllMerchandise,
  validateGetDetailMerchandise,
  validateGetAllCategory,
  validateGetCategoryDetail,
  validateCreateCategory,
  validateUpdateCategory,
  validateDeleteCategory,
  validateAuthEditUserBody,
  validateAuthDeleteUser,
  validateAuthEditUserParams,
  validateSetAuthUserParams,
  validateSetAuthUserBody,
  validateGetSupplier,
  validateCreateSupplier,
  validateEditSupplierBody,
  validateEditSupplierParams
};

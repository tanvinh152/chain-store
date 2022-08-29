const Joi = require("joi");

const getAllCategory = Joi.object().keys({});

const getDetailCategory = Joi.object().keys({
  id: Joi.string().required(),
});

const createCategory = Joi.object().keys({
  name: Joi.string().required(),
});

const updateCategoryParams = Joi.object().keys({
  id: Joi.string().required(),
});
const updateCategory = Joi.object().keys({
  name: Joi.string().required(),
});

const deleteCategory = Joi.object().keys({
  id: Joi.string().required(),
});

module.exports = {
  getAllCategory,
  getDetailCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryParams,
};

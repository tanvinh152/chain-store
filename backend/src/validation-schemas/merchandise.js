const Joi = require("joi");

const getAllMerchandise = Joi.object().keys({
  name: Joi.string().optional().allow(''),
  code: Joi.string().optional().allow(''),
  categoryId: Joi.string().optional().allow(''),
  is_hide: Joi.boolean().optional().allow(''),
});

const getDetailMerchandise = Joi.object().keys({
  id: Joi.string().required(),
});

module.exports = {
  getAllMerchandise,
  getDetailMerchandise,
};

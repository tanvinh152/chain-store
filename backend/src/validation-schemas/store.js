const Joi = require('joi');

const getStore = Joi.object().keys({
  name: Joi.string().optional().allow(''),
  phone_number: Joi.string().optional().allow(''),
  address: Joi.string().optional().allow(''),
  is_hide: Joi.boolean().optional().allow(''),
});

const createStore = Joi.object().keys({
  address: Joi.string().required(),
  phone_number: Joi.string().required(),
  name: Joi.string().required(),
  is_hide: Joi.boolean().required(),
  _id: Joi.string().optional(),
});

const deleteStore = Joi.object().keys({
  id: Joi.string().required(),
});

module.exports = {
  getStore,
  createStore,
  deleteStore,
};

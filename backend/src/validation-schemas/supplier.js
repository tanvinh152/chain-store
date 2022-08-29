const Joi = require('joi');

const getSupplier = Joi.object().keys({
    address: Joi.string().optional().allow(''),
    name: Joi.string().optional().allow(''),
    categoryId: Joi.string().optional().allow(''),
    phone_number: Joi.string().optional().allow(''),
    is_hide: Joi.boolean().optional().allow(''),
});

const createSupplier = Joi.object().keys({
    address: Joi.string().required(),
    name: Joi.string().required(),
    category_id: Joi.array().required(),
    phone_number: Joi.string().required(),
    is_hide: Joi.boolean().required(),
});
const editSupplierBody = Joi.object().keys({
    address: Joi.string().required(),
    name: Joi.string().required(),
    category_id: Joi.array().required(),
    phone_number: Joi.string().required(),
    _id: Joi.string(),
    is_hide: Joi.boolean().required(),
});

const editSupplierParams = Joi.object().keys({
    id: Joi.string().required(),
});
module.exports = {
    getSupplier,
    createSupplier,
    editSupplierBody,
    editSupplierParams,
};

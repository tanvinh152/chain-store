const Joi = require("joi");

const getWarehouse = Joi.object().keys({
  storeid: Joi.string(),
});

module.exports = {
  getWarehouse,
};

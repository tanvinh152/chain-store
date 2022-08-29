const Joi = require('joi');

const createCalendar = Joi.object().keys({
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  slot: Joi.number().required(),
  subscriber: Joi.array().items(Joi.string()),
  store: Joi.string().optional(),
});

const getCalendar = Joi.object().keys({
  fromStartTime: Joi.date(),
  toStartTime: Joi.date(),
  userId: Joi.string(),
});

const registerCalendar = Joi.object().keys({
  id: Joi.string().required(),
});

const cancelRegisterCalendar = Joi.object().keys({
  id: Joi.string().required(),
});

const deleteSpecificCalendar = Joi.object().keys({
  id: Joi.string().required(),
});

module.exports = {
  createCalendar,
  getCalendar,
  registerCalendar,
  cancelRegisterCalendar,
  deleteSpecificCalendar,
};

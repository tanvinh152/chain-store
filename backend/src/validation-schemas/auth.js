const Joi = require('joi');

const login = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const addUser = Joi.object()
  .keys({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    role: Joi.number().optional(),
    profile: {
      full_name: Joi.string().required(),
      address: Joi.string().required(),
      national_id: Joi.string().required(),
      birthday: Joi.date(),
      gender: Joi.string().required(),
    },
    store:Joi.string().optional(),
    is_hide: Joi.bool().required(),
  })
  .options({ allowUnknown: true });

const deleteUser = Joi.object().keys({
  id: Joi.string().required(),
});

const editUserParams = Joi.object().keys({
  id: Joi.string().required(),
});

const editUserBody = Joi.object().keys({
  profile: {
    full_name: Joi.string(),
    address: Joi.string(),
    national_id: Joi.string(),
    gender: Joi.string(),
  },
  is_hide: Joi.bool().required(),
});

const setRoleUserParams = Joi.object().keys({
  id: Joi.string().required(),
});

const setRoleUserBody = Joi.object().keys({
  role: Joi.string().required(),
});

module.exports = {
  login,
  addUser,
  deleteUser,
  editUserBody,
  editUserParams,
  setRoleUserParams,
  setRoleUserBody,
};

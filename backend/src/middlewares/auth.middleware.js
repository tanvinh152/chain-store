const jwt = require("jsonwebtoken");
const { User, AccessToken } = require("../models");
const { HTTP_STATUS } = require("../constant");
const { ROLE } = require("../utils/constants");

const auth = async (request, response, next) => {
  try {
    if (!request.header("Authorization")) {
      let error = new Error();
      error.name = "JsonWebTokenError";
      error.message = "Token Missing";
      throw error;
    }
    const token = request.header("Authorization").replace("Bearer ", "");
    let data = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({
      _id: data._id,
      "tokens.token": token,
    });

    if (!user) {
      let error = new Error();
      error.name = "JsonWebTokenError";
      error.message = "invalid token";
      throw error;
    }

    request.user = user;
    request.token = token;
    return next();
  } catch (err) {
    request.user = undefined;
    request.token = undefined;
    return response.status(HTTP_STATUS.UN_AUTHORIZED).json({
      code: err.name,
      message: err.message,
    });
  }
};

const manager = async (request, response, next) => {
  try {
    const user = request.user;
    if (user.role === ROLE.manager) {
      return next();
    }

    return response.status(HTTP_STATUS.UN_AUTHORIZED).json({
      code: "NO_PERMISSION",
      message: "Bạn không có quyền để thực hiện",
    });
  } catch (error) {
    return response.status(HTTP_STATUS.UN_AUTHORIZED).json({
      code: err.name,
      message: err.message,
    });
  }
};

const chainStoreManager = async (request, response, next) => {
  try {
    const user = request.user;
    if (user.role === ROLE.chainStoreManager) {
      return next();
    }

    return response.status(HTTP_STATUS.UN_AUTHORIZED).json({
      code: "NO_PERMISSION",
      message: "Bạn không có quyền để thực hiện",
    });
  } catch (error) {
    return response.status(HTTP_STATUS.UN_AUTHORIZED).json({
      code: err.name,
      message: err.message,
    });
  }
};
const admin = async (request, response, next) => {
  try {
    const user = request.user;
    if (user.role === ROLE.chainStoreManager || user.role === ROLE.manager) {
      return next();
    }

    return response.status(HTTP_STATUS.UN_AUTHORIZED).json({
      code: "NO_PERMISSION",
      message: "Bạn không có quyền để thực hiện",
    });
  } catch (error) {
    return response.status(HTTP_STATUS.UN_AUTHORIZED).json({
      code: err.name,
      message: err.message,
    });
  }
};
module.exports = {
  auth,
  manager,
  chainStoreManager,
  admin
};

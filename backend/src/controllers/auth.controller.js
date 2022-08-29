const { User, History } = require("../models");
const { HTTP_STATUS, ACTION } = require("../constant");
const bcrypt = require("bcrypt");

function login(request, response) {
  const { username, password } = request.body;

  User.authenticate(
    username,
    password.toString(),
    false,
    (result) => {
      return response.status(HTTP_STATUS.OK).json(result);
    },
    (err) => {
      return response.status(err.status).json(err);
    }
  );
}

const addUser = async (request, response) => {
  try {
    const { username, password, profile, role, store, is_hide } = request.body;
    const { storeid } = request.headers;
    const userMain = request.user
    const isExistUser = await User.findOne({ username });

    if (isExistUser) {
      return response.status(409).json("Username đã tồn tại");
    }

    let hashPassword = bcrypt.hashSync(password, 12);

    const user = new User({
      store: storeid || store,
      username,
      password_not_hash: password,
      password: hashPassword,
      profile,
      role,
      is_hide
    });

    await user.save();
    History.saveHistory(userMain._id, ACTION.CREATE_USER, user?.store, `Tạo thông tin nhân viên ${user.username}`);
    return response.status(200).json("OK");
  } catch (error) {
    console.log(error);
    return response.status(500).json("Có lỗi xảy ra");
  }
};

module.exports = {
  login,
  addUser,
};

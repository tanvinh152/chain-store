const { HTTP_STATUS, HTTP_TEXT, ACTION } = require('../constant');
const { error } = require('../interfaces');
const { Category, History } = require('../models');
const { faker } = require('@faker-js/faker');

const getCategory = async (request, response) => {
  try {
    let categories;

    categories = Category.find({});

    categories = await categories
      .sort({ createdAt: 1 })
      .select(['code', 'name']);

    return response.status(HTTP_STATUS.OK).json(categories);
  } catch (err) {
    console.log(err);
    return response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json(error(HTTP_TEXT.SERVER_ERROR));
  }
};

const createCategory = async (request, response) => {
  try {
    const user = request.user
    const { name } = request.body;
    const formatName = name.replace(name[0], name[0].toUpperCase());
    const code = formatName[0].toUpperCase() + faker.random.numeric(5);
    const category = new Category({
      name: formatName,
      code,
    });

    await category.save();
    History.saveHistory(user._id, ACTION.CREATE_CATEGORY, user?.store, `Tạo loại hàng hóa ${category.name}`);

    return response.status(HTTP_STATUS.OK).json(category);
  } catch (err) {
    console.log(err);
    return response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json(error(HTTP_TEXT.SERVER_ERROR));
  }
};

const updateCategoryDetail = async (request, response) => {
  try {
    const { id } = request.params;
    const { name } = request.body;
    const user = request.user

    let category = await Category.findById(id);

    if (!category) {
      return response.status(HTTP_STATUS.NOT_FOUND).json(HTTP_TEXT.NOT_FOUND);
    }

    category.code = name[0].toUpperCase() + faker.random.numeric(5);
    category.name = name.replace(name[0], name[0].toUpperCase());
    await category.save();
    History.saveHistory(user._id, ACTION.UPDATE_CATEGORY, user?.store, `Cập nhật loại hàng hóa ${category.name}`);

    return response.status(HTTP_STATUS.OK).json(category);
  } catch (err) {
    console.log(err);
    return response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json(error(HTTP_TEXT.SERVER_ERROR));
  }
};

const getCategoryDetail = async (request, response) => {
  try {
    const { id } = request.params;

    let category = await Category.findById(id);

    if (!category) {
      return response.status(HTTP_STATUS.NOT_FOUND).json(HTTP_TEXT.NOT_FOUND);
    }

    return response.status(HTTP_STATUS.OK).json(category);
  } catch (err) {
    console.log(err);
    return response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json(error(HTTP_TEXT.SERVER_ERROR));
  }
};

const deleteCategoryDetail = async (request, response) => {
  try {
    const { id } = request.params;
    const user = request.user;
    let category = await Category.findById(id);

    if (!category) {
      return response.status(HTTP_STATUS.NOT_FOUND).json(HTTP_TEXT.NOT_FOUND);
    }

    await category.delete();
    History.saveHistory(user._id, ACTION.DELETE_CATEGORY, user?.store,`Xóa loại hàng hóa ${category.name}`);

    return response.status(HTTP_STATUS.OK).json(HTTP_TEXT.OK);
  } catch (err) {
    console.log(err);
    return response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json(error(HTTP_TEXT.SERVER_ERROR));
  }
};

module.exports = {
  getCategory,
  createCategory,
  getCategoryDetail,
  updateCategoryDetail,
  deleteCategoryDetail,
};

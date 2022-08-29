const { faker } = require('@faker-js/faker');
const { HTTP_STATUS, HTTP_TEXT, ACTION } = require('../constant');
const { Merchandise, Category, Supplier, Store, History } = require('../models');
const moment = require('moment');

const getAllMerchandise = async (request, response) => {
    try {
        const { code, name, categoryId, is_hide } = request.query;
        let merchandises;

        merchandises = Merchandise.find({});
        if (code) {
            merchandises = merchandises.where('code').equals({ $regex: new RegExp(code, 'i') });
        }
        if (name) {
            merchandises = merchandises.where('name').equals({ $regex: new RegExp(name, 'i') });
        }
        if (categoryId) {
            merchandises = merchandises.where('category').equals(categoryId);
        }
        if (is_hide) {
            merchandises = merchandises.where('is_hide').equals(is_hide);
        }
        merchandises = await merchandises
            .populate('category store')
            .sort({ createdAt: 1 })
            .select(['code', 'name', 'store', 'category', 'is_hide']);
        return response.status(HTTP_STATUS.OK).json(merchandises);
    } catch (err) {
        console.log(err);
        return response.status(500).json('ERROR');
    }
};
const getMerchandiseActive = async (request, response) => {
    try {
        const { code, name, categoryId } = request.query;
        let merchandises;

        merchandises = Merchandise.find({ is_hide: false });
        if (code) {
            merchandises = merchandises.where('code').equals({ $regex: new RegExp(code, 'i') });
        }
        if (name) {
            merchandises = merchandises.where('name').equals({ $regex: new RegExp(name, 'i') });
        }
        if (categoryId) {
            merchandises = merchandises.where('category').equals(categoryId);
        }
        merchandises = await merchandises
            .populate('category store')
            .sort({ createdAt: 1 })
            .select(['code', 'name', 'store', 'category', 'is_hide']);
        return response.status(HTTP_STATUS.OK).json(merchandises);
    } catch (err) {
        console.log(err);
        return response.status(500).json('ERROR');
    }
};
const createMerchandise = async (request, response) => {
    try {
        const { name, category, is_hide } = request.body;     
        const user = request.user;
        const categoryMerchandise = await Category.findById({ _id: category._id });
        const merchandise = new Merchandise({
            code: name[0] + moment().format('MMDDYYYYHHmmss'),
            name,
            category: categoryMerchandise,
            is_hide
        });
        await merchandise.save();
        History.saveHistory(user._id, ACTION.CREATE_MERCHANDISE, user?.store, `Tạo hàng hóa ${merchandise.name}`);
        return response.status(HTTP_STATUS.OK).json('OK');
    } catch (error) {
        console.log(error);
        return response.status(500).json('Có lỗi xảy ra');
    }
};

const getMerchandiseDetail = async (request, response) => {
    try {
        const { id } = request.params;
        let merchandise = await Merchandise.findById(id).populate('category');
        if (!merchandise) {
            return response
                .status(HTTP_STATUS.NOT_FOUND)
                .json('Không tìm thấy hàng hóa');
        }
        return response.status(HTTP_STATUS.OK).json(merchandise);
    } catch (err) {
        console.log(err);
        return response.status(500).json('ERROR');
    }
};
const updateMerchandise = async (request, response) => {
    try {
        const { id } = request.params;
        const { name, category, is_hide } = request.body;
        const user = request.user;
        let merchandise = await Merchandise.findById(id);

        if (!merchandise) {
            return response
                .status(HTTP_STATUS.NOT_FOUND)
                .json(HTTP_TEXT.NOT_FOUND);
        }

        merchandise.code = name[0] + moment().format('MMDDYYYYHHmmss');
        merchandise.name = name.replace(name[0], name[0].toUpperCase());
        merchandise.category = category._id;
        merchandise.is_hide = is_hide;
        await merchandise.save();
        History.saveHistory(user._id, ACTION.UPDATE_MERCHANDISE, user?.store, `Cập nhật hàng hóa ${merchandise.name}`);
        return response.status(HTTP_STATUS.OK).json(merchandise);
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
};
module.exports = {
    getAllMerchandise,
    getMerchandiseActive,
    getMerchandiseDetail,
    createMerchandise,
    updateMerchandise,
};

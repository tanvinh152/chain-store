const { faker } = require('@faker-js/faker');
const { HTTP_STATUS, HTTP_TEXT, ACTION } = require('../constant');
const { error } = require('../interfaces');
const { Warehouse, Merchandise, Store, Supplier, History } = require('../models');

const getWarehouse = async (request, response) => {
    try {
        const { storeid } = request.headers;
        const { code, merchandiseId, storeId, supplierId, is_hide } = request.query;

        let warehouses = Warehouse.find({});

        if (storeid) {
            warehouses = warehouses.where('store').equals(storeid);
        }
        if (code) {
            warehouses = warehouses.where('code').equals({ $regex: new RegExp(code, 'i') });
        }
        if (merchandiseId) {
            warehouses = warehouses.where('merchandise').equals(merchandiseId);
        }
        if (storeId) {
            warehouses = warehouses.where('store').equals(storeId);
        }
        if (supplierId) {
            warehouses = warehouses.where('supplier').equals(supplierId);
        }
        if (is_hide) {
            warehouses = warehouses.where('is_hide').equals(is_hide);
        }
        warehouses = await warehouses
            .sort({ createdAt: 1 })
            .populate('supplier store merchandise')
            .select('-createdAt -updatedAt -__v');

        return response.status(HTTP_STATUS.OK).json(warehouses);
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
};
const getWarehouseActive = async (request, response) => {
    try {
        const { storeid } = request.headers;
        const { code, merchandiseId, storeId, supplierId, is_hide } = request.query;

        let warehouses = Warehouse.find({is_hide: false});

        if (storeid) {
            warehouses = warehouses.where('store').equals(storeid);
        }
        if (code) {
            warehouses = warehouses.where('code').equals({ $regex: new RegExp(code, 'i') });
        }
        if (merchandiseId) {
            warehouses = warehouses.where('merchandise').equals(merchandiseId);
        }
        if (storeId) {
            warehouses = warehouses.where('store').equals(storeId);
        }
        if (supplierId) {
            warehouses = warehouses.where('supplier').equals(supplierId);
        }
        if (is_hide) {
            warehouses = warehouses.where('is_hide').equals(is_hide);
        }

        warehouses = await warehouses
            .sort({ createdAt: 1 })
            .populate('supplier store merchandise')
            .select('-createdAt -updatedAt -__v');

        return response.status(HTTP_STATUS.OK).json(warehouses);
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
};

const createWarehouse = async (request, response) => {
    try {
        const user = request.user;
        const {
            quantity,
            unit_cost,
            price,
            expired_date,
            input_date,
            merchandise,
            supplier,
            store,
            is_hide
        } = request.body;
        const { storeid } = request.headers;
        const merchandiseWarehouse = await Merchandise.findById({ _id: merchandise._id });
        const storeWarehouse = await Store.findById({ _id: storeid || store });
        const supplierWarehouse = await Supplier.findById({ _id: supplier._id });
        const warehouse = new Warehouse({
            code: merchandise.code + '-' + faker.random.numeric(5),
            expired_date,
            unit_cost,
            price,
            input_date,
            quantity,
            store: storeWarehouse,
            supplier: supplierWarehouse,
            merchandise: merchandiseWarehouse,
            is_hide
        });
        await warehouse.save();
        History.saveHistory(user._id, ACTION.CREATE_WAREHOUSE, user?.store, `Tạo nhập kho ${warehouse.code}`);
        return response.status(HTTP_STATUS.OK).json('OK');
    } catch (error) {
        console.log(error);
        return response.status(500).json('Có lỗi xảy ra');
    }
};
const updateWarehouse = async (request, response) => {
    try {
        const { id } = request.params;
        const {
            quantity,
            unit_cost,
            price,
            expired_date,
            input_date,
            merchandise,
            supplier,
            is_hide
        } = request.body;
        const user = request.user;
        let warehouse = await Warehouse.findById(id);

        if (!warehouse) {
            return response
                .status(HTTP_STATUS.NOT_FOUND)
                .json(HTTP_TEXT.NOT_FOUND);
        }

        warehouse.quantity = quantity;
        warehouse.unit_cost = unit_cost;
        warehouse.price = price;
        warehouse.expired_date = expired_date;
        warehouse.input_date = input_date;
        warehouse.supplier = supplier._id;
        warehouse.merchandise = merchandise._id;
        warehouse.is_hide = is_hide;
        await warehouse.save();
        History.saveHistory(user._id, ACTION.UPDATE_WAREHOUSE, user?.store, `Cập nhập kho ${warehouse.code}`);

        return response.status(HTTP_STATUS.OK).json(warehouse);
    } catch (err) {
        console.log(err);
        return response
            .status(HTTP_STATUS.SERVER_ERROR)
            .json(error(HTTP_TEXT.SERVER_ERROR));
    }
};
module.exports = {
    getWarehouse,
    createWarehouse,
    updateWarehouse,
    getWarehouseActive,
};

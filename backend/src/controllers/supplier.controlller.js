const { HTTP_STATUS, HTTP_TEXT, ACTION } = require('../constant');
const { error } = require('../interfaces');
const { Supplier, Category, History } = require('../models');

async function getSupplier(request, response) {
  try {
    const { address, phone_number, name, categoryId, is_hide } = request.query;
    let suppliers = Supplier.find({});
    if (address) {
      suppliers = suppliers
        .where('address')
        .equals({ $regex: new RegExp(address, 'i') });
    }
    if (phone_number) {
      suppliers = suppliers.where('phone_number').equals({
        $regex: new RegExp(
          phone_number.replace(/[^\w\s]/gi, '').replace(' ', '.+'),
          'i'
        ),
      });
    }
    if (name) {
      suppliers = suppliers
        .where('name')
        .equals({ $regex: new RegExp(name, 'i') });
    }
    if (categoryId) {
      suppliers = suppliers.where('category._id').equals(categoryId);
    }
    if (is_hide) {
      suppliers = suppliers.where('is_hide').equals(is_hide);
    }
    suppliers = await suppliers.sort({ createdAt: 1 }).populate('category');
    return response.status(HTTP_STATUS.OK).json(suppliers);
  } catch (err) {
    console.log(err);
    return response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json(error(HTTP_TEXT.SERVER_ERROR));
  }
}
async function getSupplierActive(request, response) {
  try {
    let suppliers = Supplier.find({ is_hide: false });
    suppliers = await suppliers.sort({ createdAt: 1 }).populate('category');
    return response.status(HTTP_STATUS.OK).json(suppliers);
  } catch (err) {
    console.log(err);
    return response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json(error(HTTP_TEXT.SERVER_ERROR));
  }
}
async function getSupplierWithMerchandise(request, response) {
  try {
    const { category } = request.params;
    let suppliers = Supplier.find({
      'category._id': category,
      is_hide: false,
    });
    suppliers = await suppliers.sort({ createdAt: 1 }).populate('category');
    return response.status(HTTP_STATUS.OK).json(suppliers);
  } catch (err) {
    console.log(err);
    return response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json(error(HTTP_TEXT.SERVER_ERROR));
  }
}

async function createSupplier(request, response) {
  try {
    const user = request.user;
    const { name, phone_number, address, category_id, is_hide } = request.body;
    const supplier = new Supplier({
      name,
      phone_number,
      address,
      category: category_id,
      is_hide,
    });
    await supplier.save();
    History.saveHistory(
      user._id,
      ACTION.CREATE_SUPPLIER,
      user?.store,
      `Tạo nhà cung cấp ${supplier.name}`
    );
    return response.status(200).json('OK');
  } catch (error) {
    console.log(error);
    return response.status(500).json('Có lỗi xảy ra');
  }
}

async function updateSupplier(request, response) {
  try {
    const user = request.user;
    const { id } = request.params;
    const { name, phone_number, address, category_id, is_hide } = request.body;
    let supplier = await Supplier.findById(id);
    if (!supplier) {
      return response.status(HTTP_STATUS.NOT_FOUND).json(HTTP_TEXT.NOT_FOUND);
    }
    supplier.name = name;
    supplier.phone_number = phone_number;
    supplier.address = address;
    supplier.category = category_id;
    supplier.is_hide = is_hide;

    await supplier.save();
    History.saveHistory(
      user._id,
      ACTION.UPDATE_SUPPLIER,
      user?.store,
      `Cập nhật nhà cung cấp ${supplier.name}`
    );

    return response.status(HTTP_STATUS.OK).json('OK');
  } catch (error) {
    console.log(err);

    return response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json(error(HTTP_TEXT.SERVER_ERROR));
  }
}
module.exports = {
  getSupplier,
  createSupplier,
  updateSupplier,
  getSupplierWithMerchandise,
  getSupplierActive,
};

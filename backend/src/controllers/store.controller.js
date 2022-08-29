const { ACTION } = require('../constant');
const { Store, History } = require('../models');

const getAllStore = async (request, response) => {
  try {
    const { name, address, phone_number, is_hide } = request.query;
    let stores = Store.find({});
    if (name) {
      stores = stores.where('name').equals({ $regex: new RegExp(name, 'i') });
    }
    if (is_hide) {
      stores = stores.where('is_hide').equals(is_hide);
    }
    if (address) {
      stores = stores
        .where('address')
        .equals({ $regex: new RegExp(address, 'i') });
    }
    if (phone_number) {
      stores = stores
        .where('phone_number')
        // .equals({ $regex: new RegExp(phone_number, 'i') });
        .equals({ $regex: new RegExp(phone_number.replace(/[^\w\s]/gi, '').replace(" ", '.+'), 'i') });
    }
    stores = await stores
      .select(['name', 'address', 'phone_number', 'is_hide'])
      .lean();
    return response.status(200).json(stores);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
};

const getStoreActive = async (request, response) => {
  try {
    let stores = Store.find({ is_hide: false });

    stores = await stores
      .select(['name', 'address', 'phone_number', 'is_hide'])
      .lean();
    return response.status(200).json(stores);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
};

const getDetailStore = async (request, response) => {
  try {
    const { id } = request.params;

    const store = await Store.findById(id);

    return response.status(200).json(store);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
};

const createStore = async (request, response) => {
  try {
    const user = request.user;
    const { address, phone_number, name, is_hide } = request.body;
    const store = new Store();
    store.address = address;
    store.phone_number = phone_number;
    store.name = name;
    store.is_hide = is_hide;

    await store.save();
    History.saveHistory(
      user._id,
      ACTION.CREATE_STORE,
      user?.store,
      `Tạo cửa hàng ${store.name}`
    );
    return response.status(200).json('OK');
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
};

const updateStore = async (request, response) => {
  try {
    const user = request.user;
    const { id } = request.params;
    const { address, phone_number, name, is_hide } = request.body;

    const store = await Store.findById(id);
    if (!store) return response.status(404).json('Không tìm thấy cửa hàng');
    store.address = address;
    store.phone_number = phone_number;
    store.name = name;
    store.is_hide = is_hide;

    await store.save();
    History.saveHistory(
      user._id,
      ACTION.UPDATE_STORE,
      user?.store,
      `Cập nhập cửa hàng ${store.name}`
    );
    return response.status(200).json(store);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
};

const deleteStore = async (request, response) => {
  try {
    const user = request.user;
    const { id } = request.params;
    const store = await Store.findById(id);
    await Store.findByIdAndDelete(id);
    History.saveHistory(
      user._id,
      ACTION.DELETE_STORE,
      user?.store,
      `Xóa cửa hàng ${store.name}`
    );
    return response.status(200).json('OK');
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
};

module.exports = {
  getAllStore,
  getStoreActive,
  getDetailStore,
  createStore,
  updateStore,
  deleteStore,
};

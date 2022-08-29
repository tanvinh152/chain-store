const User = require('./user.model');
const Role = require('./role.model');
const AccessToken = require('./access-token.model');
const Store = require('./store.model');
const Calendar = require('./calendar.model');
const Category = require('./category.model');
const Merchandise = require('./merchandise.model');
const Warehouse = require('./warehouse.model');
const Supplier = require('./supplier.model');
const Bill = require('./bill.model');
const History = require('./history.model');

module.exports = {
  User,
  Role,
  AccessToken,
  Store,
  Calendar,
  History,
  Category,
  Merchandise,
  Warehouse,
  Supplier,
  Bill,
};

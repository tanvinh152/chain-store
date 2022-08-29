const { HTTP_STATUS, HTTP_TEXT } = require('../constant');
const { error } = require('../interfaces');
const moment = require('moment');
const { Bill, Store } = require('../models');

async function getRevenueYear(request, response) {
  try {
    const { storeid } = request.headers;
    const { store, year } = request.params;
    const billModel = new Bill();
    let bills;
    if (store) {
      bills = await billModel.getRevenueWithYear(store);
    }
    if (storeid) {
      bills = await billModel.getRevenueWithYear(storeid);
    }
    if (!store && !storeid) {
      bills = await billModel.getRevenueWithYear();
    }
    const billWithYear = bills.filter((b) => b._id.year === +year);
    return response
      .status(200)
      .json(billWithYear.length ? billWithYear[0].totalAmount : 0);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
}
async function getRevenueToday(request, response) {
  try {
    const { storeid } = request.headers;
    const { store } = request.params;

    const billModel = new Bill();
    let bills;
    if (store) {
      bills = await billModel.getRevenueToday(store);
    }
    if (storeid) {
      bills = await billModel.getRevenueToday(storeid);
    }
    if (!store && !storeid) {
      bills = await billModel.getRevenueToday();
    }

    return response.status(200).json(bills.length ? bills[0].totalAmount : 0);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
}
async function getRevenueMonth(request, response) {
  try {
    const { storeid } = request.headers;
    const { store, year } = request.params;

    const billModel = new Bill();
    let bills;
    if (store) {
      bills = await billModel.getRevenueWithMonth(store);
    }
    if (storeid) {
      bills = await billModel.getRevenueWithMonth(storeid);
    }
    if (!store && !storeid) {
      let stores = await Store.find({ is_hide: false });
      let revenueList = [];
      for (let element of stores) {
        bills = await billModel.getRevenueWithMonth(element._id);
        const billWithYear = bills.filter((b) => b._id.year === +year);
        billWithYear.sort(function (a, b) {
          return a._id.month - b._id.month;
        });

        const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        billWithYear.forEach((b) => {
          arr.splice(b._id.month - 1, 1, b.totalAmount);
        });
        revenueList.push({ name: element.name, data: arr });
      }
      return response.status(200).json(revenueList);
    }
    const billWithYear = bills.filter((b) => b._id.year === +year);
    billWithYear.sort(function (a, b) {
      return a._id.month - b._id.month;
    });

    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    billWithYear.forEach((b) => {
      arr.splice(b._id.month - 1, 1, b.totalAmount);
    });
    return response.status(200).json([{ name: 'Doanh thu', data: arr }]);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
}
async function getRevenueYearOfStore(request, response) {
  try {
    const { store, year } = request.params;
    const billModel = new Bill();
    const bills = await billModel.getRevenueWithYear(store);
    const billWithYear = bills.filter((b) => b._id.year === +year);

    return response
      .status(200)
      .json(billWithYear.length ? billWithYear[0].totalAmount : 0);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
}
async function getRevenueTodayOfStore(request, response) {
  try {
    const { store } = request.params;

    const billModel = new Bill();
    const bills = await billModel.getRevenueToday(store);
    return response.status(200).json(bills.length ? bills[0].totalAmount : 0);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
}
async function getRevenueMonthOfStore(request, response) {
  try {
    const { store, year } = request.params;

    const billModel = new Bill();
    const bills = await billModel.getRevenueWithMonth(store);
    const billWithYear = bills.filter((b) => b._id.year === +year);
    billWithYear.sort(function (a, b) {
      return a._id.month - b._id.month;
    });
    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    billWithYear.forEach((b) => {
      arr.splice(b._id.month - 1, 1, b.totalAmount);
    });
    return response.status(200).json([{ name: 'Doanh thu', data: arr }]);
  } catch (error) {
    console.log(error);
    return response.status(500).json('ERROR');
  }
}

module.exports = {
  getRevenueYear,
  getRevenueMonth,
  getRevenueToday,
  getRevenueMonthOfStore,
  getRevenueTodayOfStore,
  getRevenueYearOfStore,
};

const { HTTP_STATUS } = require('../constant');
const { History } = require('../models');
const moment = require('moment');
const getHistory = async (request, response) => {
  try {
    const { day, storeId } = request.query;

    let histories;

    histories = History.find({ is_hide: false }).populate('user store');
    if (storeId) {
      histories = histories.where('store').equals(storeId);
    }
    if (day) {
      const start = moment(day).startOf('day');
      const end = moment(day).startOf('day').add(1, 'day');
      histories = histories
        .where('createdAt')
        .equals({ $gte: start, $lt: end });
    }
    histories = await histories
      .sort({ createdAt: -1 })
      .select(['_id', 'action_name', 'user', 'comment', 'createdAt']);

    return response.status(HTTP_STATUS.OK).json(histories);
  } catch (err) {
    console.log(err);
    return response.status(500).json('ERROR');
  }
};

module.exports = {
  getHistory,
};

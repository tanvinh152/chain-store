require("dotenv").config();
// require("dotenv").config({ path: __dirname + "/./../../.env" });
const { MONGODB_URL } = process.env;

module.exports = {
  database_url: MONGODB_URL,
  ROLE: {
    staff: 0,
    manager: 1,
    chainStoreManager: 2,
  },
};

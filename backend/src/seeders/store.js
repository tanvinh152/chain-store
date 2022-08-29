const { Store } = require("../models");
const mongoose = require("mongoose");
const { database_url } = require("../utils/constants");
const { faker } = require("@faker-js/faker");

let stores = [];
const LOOP = 2;
for (let i = 0; i < LOOP; i++) {
  const store = new Store({
    address: `${faker.address.streetAddress()}, ${faker.address.city()}`,
    phone_number: faker.phone.phoneNumber("+84 ### ### ###"),
  });

  stores = [...stores, store];
}

mongoose
  .connect(database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");
  });

Store.insertMany(stores).then(() => {
  process.exit(1);
});

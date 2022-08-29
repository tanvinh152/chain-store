const { faker } = require("@faker-js/faker");
const { connect } = require("mongoose");
const { Category } = require("../models");
const Supplier = require("../models/supplier.model");
const { database_url } = require("../utils/constants");

console.log(database_url);

const LOOP = 10;

connect(database_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(async () => {
    const categories = await Category.find({});
    let suppliers = [];
    for (let i = 0; i < LOOP; i++) {
      const randomCategories = faker.helpers.arrayElement(categories);
      const phone_number = faker.phone.phoneNumber("+84 ### ### ###");
      const address = `${faker.address.streetAddress()}, ${faker.address.city()}`;
      const name = faker.company.companyName();
      const supplier = new Supplier({
        category: randomCategories._id,
        phone_number,
        address,
        name,
      });

      suppliers = [...suppliers, supplier];
    }
    console.log("connected to db in development environment");
    Supplier.insertMany(suppliers).then(() => {
      process.exit(1);
    });
  });

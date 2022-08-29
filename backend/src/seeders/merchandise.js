const { Store, Category, Merchandise } = require("../models");
const mongoose = require("mongoose");
const { database_url } = require("../utils/constants");
const { faker } = require("@faker-js/faker");
const moment = require("moment");

const LOOP = 50;

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
  .then(async () => {
    const categories = await Category.find({});
    let merchandises = [];
    for (let i = 0; i < LOOP; i++) {
      const randomCategories = faker.helpers.arrayElement(categories);
      const productName = faker.commerce.product();
      const merchandise = new Merchandise({
        code: productName[0] + moment().format("MMDDYYYYHHmmss"),
        name: productName,
        store: randomCategories.store,
        category: randomCategories._id,
      });

      merchandises = [...merchandises, merchandise];
    }
    console.log("connected to db in development environment");
    Merchandise.insertMany(merchandises).then(() => {
      process.exit(1);
    });
  });
  
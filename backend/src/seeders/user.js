const { User, Store } = require("../models");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { database_url } = require("../utils/constants");
const { faker } = require("@faker-js/faker");

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
    console.log("connected to db in development environment");
    let users = [];

    const stores = await Store.find({});
    const genders = ["men", "women"];
    for (let i = 0; i < 10; i++) {
      const random = Math.floor(Math.random() * 2);
      let profile = {
        full_name: faker.name.findName(),
        address: faker.address.city(),
        gender: genders[random],
        image: faker.internet.avatar(),
        birthday: faker.date.birthdate({ min: 16, max: 25, mode: "age" }),
      };

      let password = faker.internet.password(6).toLowerCase();
      let hashPassword = bcrypt.hashSync(password, 12);
      let randomStores = faker.helpers.arrayElement(stores);
      let user = new User({
        username: faker.internet.userName().toLowerCase(),
        password: hashPassword,
        password_not_hash: password,
        store: randomStores._id,
        profile,
      });
      users = [...users, user];
    }
    User.insertMany(users).then(() => {
      process.exit(1);
    });
  });

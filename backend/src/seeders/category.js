const { Category, Store } = require('../models');
const mongoose = require('mongoose');
const { database_url } = require('../utils/constants');
const { faker } = require('@faker-js/faker');

let categories = [];
const LOOP = 10;

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
        const stores = await Store.find({});
        for (let i = 0; i < LOOP; i++) {
            const randomStores = faker.helpers.arrayElement(stores);
            const categoryName = faker.commerce.department();
            const category = new Category({
                code: categoryName[0] + faker.random.numeric(5),
                name: categoryName,
                store: randomStores._id,
            });

            categories = [...categories, category];
        }
        Category.insertMany(categories).then(() => {
            console.log('connected to db in development environment');
            process.exit(1);
        });
    });

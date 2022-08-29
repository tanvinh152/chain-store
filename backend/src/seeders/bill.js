const {
    Store,
    Category,
    Merchandise,
    User,
    Warehouse,
    Bill,
} = require("../models");
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
        const user = await User.find({});
        const warehouse = await Warehouse.find({});
        let bills = [];
        for (let i = 0; i < LOOP; i++) {
            let total = 0;
            const randomUser = faker.helpers.arrayElement(user);
            const randomWarehouse = faker.helpers.arrayElement(warehouse);
            const randomQuantity = faker.datatype.number({ min: 1, max: 3 });
            if (
                JSON.stringify(randomWarehouse.store) ===
                JSON.stringify(randomUser.store)
            ) {
                let merchandises = [];
                for (let index = 0; index < 1; index++) {
                    const warehouseSeeder = await Warehouse.findOne({
                        merchandise: randomWarehouse.merchandise,
                    });
                    warehouseSeeder.quantity -= randomQuantity;
                    await warehouseSeeder.save();
                    total += randomWarehouse.price * randomQuantity;
                    merchandises.push({
                        merchandise: randomWarehouse.merchandise,
                        price: randomWarehouse.price,
                        quantity: randomQuantity,
                    });
                }
                const bill = new Bill({
                    code: "HD" + moment().format("MMDDYYYYHHmmss"),
                    merchandises,
                    cashier: randomUser._id,
                    total,
                    store: randomWarehouse.store,
                });

                bills = [...bills, bill];
            }
        }
        console.log(bills);
        console.log("connected to db in development environment");
        Bill.insertMany(bills).then(() => {
            process.exit(1);
        });
    });

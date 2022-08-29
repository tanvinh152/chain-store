const { User, Calendar, Store } = require("../models");
const mongoose = require("mongoose");
const { database_url } = require("../utils/constants");
const { faker } = require("@faker-js/faker");
const { getFirstLastDateInWeek } = require("../utils/functions");

let calendars = [];
const { firstDay, lastDay } = getFirstLastDateInWeek();

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
        const times = faker.date.betweens(firstDay, lastDay);

        for (let i = 0; i < LOOP; i++) {
            const slot = [5, 6, 7, 8];
            const randomStores = faker.helpers.arrayElement(stores);

            const calendar = new Calendar({
                startTime: times[i],
                endTime: faker.date.soon(1, times[i]),
                slot: faker.helpers.arrayElement(slot),
                // subscriber: [],
                store: randomStores._id,
            });

            calendars = [...calendars, calendar];
        }
        console.log("connected to db in development environment");
        Calendar.insertMany(calendars).then(() => {
            process.exit(1);
        });
    });

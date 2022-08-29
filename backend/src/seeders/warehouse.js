const {
    Store,
    Merchandise,
    Warehouse,
    Supplier,
    Category,
} = require("../models");
const mongoose = require("mongoose");
const { database_url } = require("../utils/constants");
const { faker } = require("@faker-js/faker");

const LOOP = 50;

// merchandise: { type: Schema.Types.ObjectId, ref: "merchandises" },
// quantity: { type: Number, default: 0 },
// category: { type: Schema.Types.ObjectId, ref: "categories" },
// status: {
//   type: String,
//   enum: ["available", "expired"],
//   default: "available",
// },
// store: { type: Schema.Types.ObjectId, ref: "stores" },
// supplier: { type: Schema.Types.ObjectId, ref: "suppliers" },

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
        const merchandises = await Merchandise.find({});
        const suppliers = await Supplier.find({});

        let warehouses = [];
        for (let i = 0; i < LOOP; i++) {
            const randomMerchandises = faker.helpers.arrayElement(merchandises);
            const randomSuppliers = faker.helpers.arrayElement(suppliers);
            if (
                JSON.stringify(randomMerchandises.category) ===
                JSON.stringify(randomSuppliers.category)
            ) {
                const category = await Category.findById({
                    _id: randomMerchandises.category,
                });
                const cost = faker.commerce.price(100);
                const inputDate = faker.date.past(1, new Date().toISOString());
                const warehouse = new Warehouse({
                    code:
                        randomMerchandises.code + "-" + faker.random.numeric(5),
                    expired_date: faker.date.future(
                        faker.random.numeric(1),
                        inputDate
                    ),
                    unit_cost: cost,
                    price:
                        Number.parseFloat(cost) +
                        Number.parseFloat(faker.random.numeric(3)),
                    input_date: inputDate,
                    quantity: faker.random.numeric(3),
                    merchandise: randomMerchandises._id,
                    store: category.store,
                    supplier: randomSuppliers._id,
                });

                warehouses = [...warehouses, warehouse];
            }
        }
        Warehouse.insertMany(warehouses).then(() => {
            console.log("Insert warehouse successful");
            process.exit(1);
        });
    });

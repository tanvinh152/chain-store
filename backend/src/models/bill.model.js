const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");

const billSchema = new Schema(
    {
        code: { type: String, default: "" },
        merchandises: [
            {
                merchandise: {
                    type: Schema.Types.ObjectId,
                    ref: "merchandises",
                },
                price: { type: Number, default: 0 },
                quantity: { type: Number, default: 0 },
            },
        ],
        store: { type: Schema.Types.ObjectId, ref: "stores" },
        cashier: { type: Schema.Types.ObjectId, ref: "users" },
        total: { type: Number, default: 0 },
        is_hide: { type: Boolean, default: false }
    },
    { timestamps: { currentTime: () => Date.now() } }
);

billSchema.methods.getRevenueWithYear = async function (store_id) {
    const ObjectId = mongoose.Types.ObjectId;
    let bills;
    if (store_id) {
        bills = await Bill.aggregate([
            {
                $match: {
                    store: ObjectId(store_id),
                },
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" } },
                    totalAmount: { $sum: "$total" },
                },
            },
        ]);
    } else {
        bills = await Bill.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$createdAt" } },
                    totalAmount: { $sum: "$total" },
                },
            },
        ]);
    }
    return bills;
};
billSchema.methods.getRevenueWithMonth = async function (store_id) {
    const ObjectId = mongoose.Types.ObjectId;
    let bills;
    if (store_id) {
        bills = await Bill.aggregate([
            {
                $match: {
                    store: ObjectId(store_id),
                },
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    totalAmount: { $sum: "$total" },
                },
            },
        ]);
    } else {
        bills = await Bill.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    totalAmount: { $sum: "$total" },
                },
            },
        ]);
    }

    return bills;
};
billSchema.methods.getRevenueToday = async function (store_id) {
    const ObjectId = mongoose.Types.ObjectId;
    const day = moment().format("YYYY-MM-DD");
    const dateFrom = `${day}T00:00:00.424Z`;
    const dateTo = `${day}T23:59:59.424Z`;
    let match_stage;
    if (store_id) {
        match_stage = {
            $match: {
                store: ObjectId(store_id),
                createdAt: {
                    $gte: new Date(dateFrom),
                    $lte: new Date(dateTo),
                },
            },
        };
    } else {
        match_stage = {
            $match: {
                createdAt: {
                    $gte: new Date(dateFrom),
                    $lte: new Date(dateTo),
                },
            },
        };
    }
    const group_stage = {
        $group: {
            _id: { day: { $dayOfYear: "$createdAt" } },
            totalAmount: { $sum: "$total" },
        },
    };
    const pipeline = [match_stage, group_stage];
    const bills = await Bill.aggregate(pipeline);
    return bills;
};

const Bill = mongoose.model("bills", billSchema);

module.exports = Bill;

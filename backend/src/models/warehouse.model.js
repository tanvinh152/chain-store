const mongoose = require("mongoose");
const { Schema } = mongoose;

const warehouseSchema = new Schema(
  {
    code: { type: String, default: "" },
    merchandise: { type: Schema.Types.ObjectId, ref: "merchandises" },
    quantity: { type: Number, default: 0 },
    store: { type: Schema.Types.ObjectId, ref: "stores" },
    unit_cost: { type: Number, default: 0 }, //Real Price
    price: { type: Number, default: 0 }, //Sale Price
    expired_date: { type: Date, default: new Date() },
    input_date: { type: Date, default: new Date() },
    supplier: { type: Schema.Types.ObjectId, ref: "suppliers" },
    is_hide: { type: Boolean, default: false }
  },
  { timestamps: { currentTime: () => Date.now() } }
);

const Warehouse = mongoose.model("warehouses", warehouseSchema);

module.exports = Warehouse;

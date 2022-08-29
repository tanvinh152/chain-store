const mongoose = require("mongoose");
const { Schema } = mongoose;

const storeSchema = new Schema(
  {
    name: { type: String, default: "" },
    address: { type: String, default: "" },
    phone_number: { type: String, default: "" },
    is_hide: { type: Boolean, default: false }
  },
  { timestamps: { currentTime: () => Date.now() } }
);

const Store = mongoose.model("stores", storeSchema);

module.exports = Store;

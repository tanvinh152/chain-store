const mongoose = require("mongoose");
const { Schema } = mongoose;

const merchandiseSchema = new Schema(
  {
    code: { type: String, default: "" },
    name: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "categories" },
    store: { type: Schema.Types.ObjectId, ref: "stores" },
    is_hide: { type: Boolean, default: false }
  },
  { timestamps: { currentTime: () => Date.now() } }
);

const Merchandise = mongoose.model("merchandises", merchandiseSchema);

module.exports = Merchandise;

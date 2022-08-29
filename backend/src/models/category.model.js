const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    code: { type: String, default: "" },
    name: { type: String, default: "" },
    is_hide: { type: Boolean, default: false }
  },
  { timestamps: { currentTime: () => Date.now() } }
);

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;
  
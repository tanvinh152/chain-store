const mongoose = require('mongoose');
const { Schema } = mongoose;

const supplierSchema = new Schema(
  {
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    phone_number: { type: String, default: '' },
    category: [
      {
        _id: { type: Schema.Types.ObjectId, ref: 'categories' },
        name: { type: String, default: '' },
        code: { type: String, default: '' },
      },
    ],
    is_hide: { type: Boolean, default: false },
  },
  { timestamps: { currentTime: () => Date.now() } }
);

const Supplier = mongoose.model('suppliers', supplierSchema);

module.exports = Supplier;

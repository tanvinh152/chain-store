const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    action_name: { type: String, default: '' },
    comment: { type: String, require: true },
    is_hide: { type: Boolean, default: false },
    store: { type: Schema.Types.ObjectId, ref: "stores" },
  },
  { timestamps: { currentTime: () => Date.now() } }
);

historySchema.statics.saveHistory = async function (
  userId,
  actionName,
  storeId,
  comment
) {
  try {
    const history = new History({
      user: userId,
      action_name: actionName,
      store: storeId,
      comment,
    });

    await history.save();
  } catch (error) {
    throw error;
  }
};

const History = mongoose.model('histories', historySchema);

module.exports = History;

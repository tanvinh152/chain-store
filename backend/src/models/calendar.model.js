const mongoose = require("mongoose");
const { Schema } = mongoose;

const calendarSchema = new Schema(
  {
    startTime: { type: Date, default: Date.now() },
    endTime: { type: Date, default: Date.now() },
    slot: { type: Number, default: 0 },
    subscriber: [{ type: Schema.Types.ObjectId, ref: "users" }],
    store: { type: Schema.Types.ObjectId, ref: "stores" },
  },
  { timestamps: { currentTime: () => Date.now() } }
);

const Calendar = mongoose.model("calendars", calendarSchema);

module.exports = Calendar;

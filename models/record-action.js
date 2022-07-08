const mongoose = require("mongoose");

const recordActionSchema = new mongoose.Schema(
  {
    event_id: { type: String, required: true },
    device: String,
    time: Date,
    country: String,
    note: String,
    appVersion: String,
  },
  { versionKey: false }
);

const RecordAction = mongoose.model(
  "RecordAction",
  recordActionSchema,
  "record_action"
);
module.exports = RecordAction;

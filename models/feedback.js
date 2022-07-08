const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    questionId: { type: String, required: true },
    langCode: { type: String, required: true },
    feedback: { type: String, required: true },
    os: String,
    device: String,
    time: Date,
    country: String,
    note: String,
    dbVersion: String,
    fixed: Boolean,
  },
  { versionKey: false }
);

const Feedback = mongoose.model("Feedback", feedbackSchema, "feedback");
module.exports = Feedback;

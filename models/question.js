const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    topicId: String,
    id: String,
    langCode: String,
    question: String,
    answers: Object,
    correctAnswer: Number,
    level: Number,
    explanation: String,
    changed: Number,
    version: Number,
  },
  { versionKey: false }
);

const Question = mongoose.model("Question", questionSchema, "question");
module.exports = Question;

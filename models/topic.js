const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    id: String,
    fileName: String,
    langCode: String,
    title: String,
  },
  { versionKey: false }
);

const Topic = mongoose.model("Topic", topicSchema, "topic");
module.exports = Topic;

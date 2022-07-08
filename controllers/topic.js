const Topic = require("../models/topic");
const Question = require("../models/question");
const crypto = require("../common/crypto");

/**
 * @param {String} topicId
 * @param {String} langCode
 * @returns number of questions
 */
const quesNumber = async (topicId, langCode, flag) => {
  let count = 0;
  const conditions = { topicId: topicId, langCode: langCode };
  if (flag) {
    conditions["changed"] = flag;
  }
  count = await Question.countDocuments(conditions).exec();
  return count;
};

// List topic
module.exports.index = async (req, res) => {
  const topics = await Topic.find().lean();
  const newTopics = await Promise.all(
    topics.map(async (topic) => ({
      ...topic,
      quesNumber: await quesNumber(topic.id, topic.langCode, false),
      quesUpdateNumber: await quesNumber(topic.id, topic.langCode, true),
    }))
  );

  res.render("topics/index", {
    topics: newTopics,
  });
};

// Topic detail
module.exports.detail = async (req, res) => {
  const arrKeys = req.params.id.split("-");
  const topic = await Topic.find({
    id: arrKeys[0],
    langCode: arrKeys[1],
  }).lean();

  const questions = await Question.find({
    topicId: arrKeys[0],
    langCode: arrKeys[1],
  }).sort({ id: -1 });

  questions.forEach((question) => {
    question["question"] = crypto.decrypt(question["question"]);
    question["explanation"] = crypto.decrypt(question["explanation"]);
  });

  res.render("topics/detail", {
    topic: topic[0],
    questions: questions,
  });
};

// Create topic
module.exports.create = async (req, res) => {
  const titleVi = req.body.titleVi;
  const titleEn = req.body.titleEn;

  const existVi = await Topic.findOne({ langCode: "vi", title: titleVi });
  const existEn = await Topic.findOne({ langCode: "en", title: titleEn });
  if (existVi || existEn) {
    const topics = await Topic.find().lean();
    const newTopics = await Promise.all(
      topics.map(async (topic) => ({
        ...topic,
        quesNumber: await quesNumber(topic.id, topic.langCode, false),
        quesUpdateNumber: await quesNumber(topic.id, topic.langCode, true),
      }))
    );

    res.render("topics/index", {
      topics: newTopics,
      values: req.body,
      errors: ["Topic already exists, please check again"],
    });
  } else {
    const lastTopic = await Topic.findOne({}, {}, { sort: { id: -1 } });
    const lastId = lastTopic ? parseInt(lastTopic["id"]) + 1 : 1;

    await Topic.insertMany([
      {
        id: lastId.toString(),
        fileName: `${titleEn.toLowerCase()}_q_vi.json`,
        langCode: "vi",
        title: titleVi,
      },
      {
        id: lastId.toString(),
        fileName: `${titleEn.toLowerCase()}_q_en.json`,
        langCode: "en",
        title: titleEn,
      },
    ]);

    res.redirect("/topics");
  }
};

// Edit topic
module.exports.edit = async (req, res) => {
  const arrKeys = req.params.id.split("-");
  await Topic.findOneAndUpdate(
    { id: arrKeys[0], langCode: arrKeys[1] },
    { title: req.body.title }
  );

  res.end('{"status" : 200}');
};

// Delete topic
module.exports.delete = async (req, res) => {
  const topicId = req.params.id;
  await Topic.deleteMany({ id: topicId });
  await Question.deleteMany({
    topicId: topicId,
  });

  res.redirect("/topics");
};

const crypto = require("../common/crypto");
const Question = require("../models/question");
const Topic = require("../models/topic");

/**
 *
 * @param {String} topicId
 * @param {String} langCode
 * @returns topic title
 */
const getTopicTitle = async (topicId, langCode) => {
  const topic = await Topic.findOne({ id: topicId, langCode: langCode }).lean();
  return topic["title"];
};

module.exports.index = async (req, res) => {
  // Version
  const infor = [];
  const firstQuestion = await Question.findOne({}, {}, { sort: { id: 1 } });
  firstQuestion ? infor.push(firstQuestion["version"]) : infor.push(0);

  // Topic number
  const topicGroup = await Question.aggregate([
    { $match: { changed: { $gte: 1 } } },
    {
      $group: { _id: { topicId: "$topicId" } },
    },
  ]).exec();
  infor.push(topicGroup.length);

  // Modified questions number
  const questionNumber = await Question.countDocuments({
    changed: { $gte: 1 },
  }).exec();
  infor.push(questionNumber);

  // Get questions
  const questions = await Question.find({
    changed: { $gte: 1 },
  })
    .sort({ id: -1 })
    .lean();

  const mergeQuestions = await Promise.all(
    questions.map(async (ques) => ({
      ...ques,
      topicTitle: await getTopicTitle(ques.topicId, ques.langCode),
      question: crypto.decrypt(ques.question),
      explanation: crypto.decrypt(ques.explanation),
    }))
  );

  res.render("modified-questions/index", {
    infor: infor,
    questions: mergeQuestions,
  });
};

// Edit question
module.exports.edit = async (req, res) => {
  const arrKeys = req.params.id.split("-");
  const answers = [
    req.body.answerA,
    req.body.answerB,
    req.body.answerC,
    req.body.answerD,
  ];
  const cryptoQuestion = crypto.encrypt(req.body.question);
  const cryptoEx = crypto.encrypt(req.body.explain);

  await Question.findOneAndUpdate(
    {
      id: arrKeys[0],
      langCode: arrKeys[1],
      changed: { $lte: 1 },
    },
    {
      question: cryptoQuestion,
      answers: answers,
      correctAnswer: parseInt(req.body.correctAnswer),
      explanation: cryptoEx,
      changed: 1,
    }
  );
  res.end('{"status" : 200}');
};

// Revert question
module.exports.revert = async (req, res) => {
  const arrKeys = req.params.id.split("-");

  await Question.findOneAndUpdate(
    {
      id: arrKeys[0],
      langCode: arrKeys[1],
    },
    {
      changed: 0,
    }
  );

  res.redirect("/modified-questions");
};

// Delete question
module.exports.delete = async (req, res) => {
  const arrKeys = req.params.id.split("-");
  await Question.deleteMany({
    id: arrKeys[0],
  });

  res.redirect("/modified-questions");
};

const crypto = require("../common/crypto");
const Feedback = require("../models/feedback");
const Question = require("../models/question");
const Topic = require("../models/topic");
const moment = require("moment-timezone");
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

// List feedbacks
module.exports.index = async (req, res) => {
  const infor = [];
  const firstQuestion = await Question.findOne({}, {}, { sort: { id: 1 } });
  firstQuestion ? infor.push(firstQuestion["version"]) : infor.push(0);

  const groupFeedbacks = await Feedback.aggregate([
    {
      $group: {
        _id: { questionId: "$questionId", langCode: "$langCode" },
      },
    },
    { $sort: { _id: -1 } },
  ]).exec();

  const questions = [];
  for (const groupFeedback of groupFeedbacks) {
    const countFeedbacks = await Feedback.countDocuments({
      questionId: groupFeedback["_id"]["questionId"],
      langCode: groupFeedback["_id"]["langCode"],
    }).exec();
    const ques = await Question.findOne({
      id: groupFeedback["_id"]["questionId"],
      langCode: groupFeedback["_id"]["langCode"],
    }).lean();

    if (ques) {
      ques["numberFeedbacks"] = countFeedbacks;
      ques["topicTitle"] = await getTopicTitle(ques.topicId, ques.langCode);
      ques["question"] = crypto.decrypt(ques.question);
      ques["explanation"] = crypto.decrypt(ques.explanation);
      questions.push(ques);
    }
  }

  infor.push(questions ? questions.length : 0);
  res.render("feedbacks/index", {
    infor: infor,
    questions: questions,
  });
};

// Detail question
module.exports.detail = async (req, res) => {
  const arrKeys = req.params.id.split("-");
  const questionId = arrKeys[0];
  const langCode = arrKeys[1];

  const question = await Question.findOne(
    {
      id: questionId,
      langCode: langCode,
    },
    { _id: 0 }
  ).lean();

  const topic = await Topic.findOne({
    id: question.topicId,
    langCode: question.langCode,
  }).lean();

  question["question"] = crypto.decrypt(question["question"]);
  question["explanation"] = crypto.decrypt(question["explanation"]);
  question["topicTitle"] = topic["title"];

  //Get feedbacks list
  const feedbacks = await Feedback.find(
    {
      questionId: questionId,
      langCode: langCode,
    },
    { _id: 0 }
  )
    .sort({ time: -1 })
    .lean();

  if (feedbacks) {
    for (const feedback of feedbacks) {
      feedback["time"] = moment(feedback["time"]).format("DD/MM/YYYY HH:mm");
    }
  }
  question["feedbacks"] = feedbacks;
  res.json({ data: question });
};

// Delete all feedback of choose question
module.exports.deleteAll = async (req, res) => {
  const arrKeys = req.params.id.split("-");
  await Feedback.deleteMany({ questionId: arrKeys[0], langCode: arrKeys[1] });
  res.end('{"status" : 200}');
};

// Fix feedback
module.exports.fixed = async (req, res) => {
  await Feedback.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      fixed: req.params.status == "true" ? false : true,
    }
  );
  res.end('{"status" : 200}');
};

// Delete feedback
module.exports.deleteOne = async (req, res) => {
  await Feedback.findOneAndDelete({ id: req.params.id });
  res.end('{"status" : 200}');
};

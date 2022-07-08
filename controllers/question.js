const crypto = require("../common/crypto");
const Topic = require("../models/topic");
const Question = require("../models/question");

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

  res.json({ data: question });
};

// Create question
module.exports.create = async (req, res) => {
  const lastQuestion = await Question.findOne(
    { topicId: req.query.topicId, langCode: req.query.langCode },
    {},
    { sort: { id: -1 } }
  );

  const lastQuestionId = lastQuestion
    ? parseInt(lastQuestion["id"]) + 1
    : parseInt(req.query.topicId) * 1000;

  const cryptoQuestion = crypto.encrypt(req.body.question);
  const cryptoExlainVi = crypto.encrypt(req.body.explainVi);
  const cryptoExlainEn = crypto.encrypt(req.body.explainEn);

  const existQuestion = await Question.findOne({
    question: cryptoQuestion,
  });

  if (existQuestion) {
    const topic = await Topic.find({
      id: req.query.topicId,
      langCode: req.query.langCode,
    }).lean();

    const questions = await Question.find({
      topicId: req.query.topicId,
      langCode: req.query.langCode,
    }).sort({ id: -1 });

    questions.forEach((question) => {
      question["question"] = crypto.decrypt(question["question"]);
      question["explanation"] = crypto.decrypt(question["explanation"]);
    });

    res.render("topics/detail", {
      topic: topic[0],
      questions: questions,
      values: req.body,
      errors: ["Question already exists, please check again"],
      messages: [],
    });
  } else {
    let version = 0;
    const firstQuestion = await Question.findOne({}, {}, { sort: { id: 1 } });
    version = firstQuestion["version"];

    const answer = [
      req.body.correctAnswer,
      req.body.answerOne,
      req.body.answerTwo,
      req.body.answerThree,
    ];
    const ramdomAnswer = [];
    const tmp = [];
    while (ramdomAnswer.length < 4) {
      tmp.push(
        answer.splice(Math.floor(Math.random() * answer.length - 1), 1)[0]
      );
      ramdomAnswer.push(tmp.pop());
    }

    await Question.insertMany([
      {
        topicId: req.query.topicId,
        id: lastQuestionId.toString(),
        langCode: "vi",
        question: cryptoQuestion,
        answers: ramdomAnswer,
        correctAnswer: ramdomAnswer.indexOf(req.body.correctAnswer),
        level: req.body.ansLevel,
        explanation: cryptoExlainVi,
        changed: 2,
        version: version,
      },
      {
        topicId: req.query.topicId,
        id: lastQuestionId.toString(),
        langCode: "en",
        question: cryptoQuestion,
        answers: ramdomAnswer,
        correctAnswer: ramdomAnswer.indexOf(req.body.correctAnswer),
        level: req.body.ansLevel,
        explanation: cryptoExlainEn,
        changed: 2,
        version: version,
      },
    ]);

    res.redirect(`/topics/${req.query.topicId}-${req.query.langCode}`);
  }
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

// Delete question
module.exports.delete = async (req, res) => {
  const topicId = req.params.topicId;
  const arrKeys = req.params.id.split("-");
  await Question.deleteMany({
    id: arrKeys[0],
  });

  res.redirect(`/topics/${topicId}-${arrKeys[1]}`);
};

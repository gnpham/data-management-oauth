const fs = require("fs");
const path = require("path");
const Topic = require("../models/topic");
const Question = require("../models/question");
const multiFilesUpload = require("../common/upload-file");

module.exports.index = (req, res) => {
  res.render("import-data/index");
};

module.exports.import = async (req, res) => {
  try {
    await multiFilesUpload(req, res);
  } catch (err) {
    res.render("import-data/index", {
      errors: [err],
    });
    return;
  }

  // Clean database
  await Topic.deleteMany();
  await Question.deleteMany();

  // Import topics
  if (fs.existsSync("./json-input/topics.json")) {
    const topics = fs.readFileSync("./json-input/topics.json");
    Topic.insertMany(JSON.parse(topics.toString()));
  }

  // Import questions
  const jsonDir = fs
    .readdirSync("./json-input")
    .filter(
      (file) =>
        path.extname(file) === ".json" && path.basename(file) !== "topics.json"
    );
  if (jsonDir.length) {
    let questions = [];
    await jsonDir.forEach((file) => {
      const quesData = fs.readFileSync(path.join("./json-input", file));
      const ques = JSON.parse(quesData.toString());
      ques.map((q) => {
        q["changed"] = 0;
        q["version"] = req.body.version;
      });
      questions = questions.concat(ques);
    });
    Question.insertMany(questions);
  }

  res.render("import-data/index", {
    success: ["Import successfully"],
  });
};

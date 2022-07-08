const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const Topic = require("../models/topic");
const Question = require("../models/question");

/**
 *
 * @param {String} topicId
 * @param {String} langCode
 * @returns {zString} file's name of topic
 */
const exportJsonFiles = async (topicId, langCode) => {
  const topic = await Topic.findOne({
    id: topicId,
    langCode: langCode,
  });

  const questions = await Question.find(
    {
      topicId: topicId,
      langCode: langCode,
    },
    { _id: false }
  )
    .select(["-changed", "-version"])
    .sort({ id: 1 })
    .lean();

  fs.writeFileSync(
    path.join("./json-output", topic["fileName"]),
    JSON.stringify(questions, null, 2)
  );

  return topic["fileName"];
};

/**
 *
 * @param {Number} changedFlag
 * @param {String} action
 * @returns {object} export data
 */
const getFileMigrationData = async (changedFlag, action) => {
  const groupQuestions = await Question.aggregate([
    {
      $match: { changed: changedFlag },
    },
    { $sort: { id: 1 } },
    {
      $group: {
        _id: { topic: "$topicId" },
        questions: { $addToSet: "$id" },
      },
    },
    { $sort: { _id: 1 } },
  ]).exec();

  const data = [];
  for (const groupQues of groupQuestions) {
    groupQues["_id"].questions = groupQues["questions"];
    data.push(groupQues["_id"]);
  }

  const exportData = { type: action, data: data };
  return exportData;
};

module.exports.export = async (req, res) => {
  // Get first question
  const firstQuestion = await Question.findOne(
    {},
    {},
    { sort: { id: 1 } }
  ).lean();

  // Get migration data
  const batchData = await getFileMigrationData(1, "batch");
  const newData = await getFileMigrationData(2, "new");
  const migrateData = [];

  if (batchData["data"].length > 0) {
    migrateData.push(batchData);
  }

  if (newData["data"].length > 0) {
    migrateData.push(newData);
  }

  // Get list file export
  const groupQuestion = await Question.aggregate([
    {
      $match: { changed: { $gte: 1 } },
    },
    { $group: { _id: { topicId: "$topicId" } } },
    { $sort: { _id: 1 } },
  ]).exec();

  const filesExport = [];
  for (const question of groupQuestion) {
    const fileNameEn = await exportJsonFiles(question["_id"]["topicId"], "en");
    const fileNameVi = await exportJsonFiles(question["_id"]["topicId"], "vi");
    filesExport.push(fileNameEn, fileNameVi);
  }

  res.render("export-data/index", {
    version: firstQuestion["version"],
    migrationData: [
      `${firstQuestion["version"]}: ${JSON.stringify(migrateData, null, 2)}`,
    ],
    filesExport: filesExport,
  });
};

module.exports.download = (req, res) => {
  const outputDir = "./json-output";
  child_process.execSync(`zip -r kcm-output *`, {
    cwd: outputDir,
  });

  res.download(outputDir + "/kcm-output.zip");
  res.status(200);
};

module.exports.updateVersion = async (req, res) => {
  req.app.locals.markUpdated = true;
  await Question.updateMany({
    changed: 0,
    version: req.body.version,
  });
  res.redirect("/topics");
};

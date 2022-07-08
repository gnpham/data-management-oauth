const express = require("express");
const modifiedQuestionRouter = express.Router();
const modifiedQuestionController = require("../controllers/modified-question");

modifiedQuestionRouter.get("/", modifiedQuestionController.index);
modifiedQuestionRouter.post("/edit/:id", modifiedQuestionController.edit);
modifiedQuestionRouter.get("/revert/:id", modifiedQuestionController.revert);
modifiedQuestionRouter.get("/delete/:id", modifiedQuestionController.delete);

module.exports = modifiedQuestionRouter;

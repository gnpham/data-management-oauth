const express = require("express");
const questionRouter = express.Router();
const questionController = require("../controllers/question");

questionRouter.get("/:id", questionController.detail);
questionRouter.post("/create", questionController.create);
questionRouter.post("/edit/:id", questionController.edit);
questionRouter.get("/delete/:topicId/:id", questionController.delete);

module.exports = questionRouter;

const express = require("express");
const topicRouter = express.Router();
const topicController = require("../controllers/topic");

topicRouter.get("/", topicController.index);
topicRouter.get("/:id", topicController.detail);
topicRouter.post("/create", topicController.create);
topicRouter.post("/edit/:id", topicController.edit);
topicRouter.get("/delete/:id", topicController.delete);

module.exports = topicRouter;

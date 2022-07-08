const express = require("express");
const feedbackController = require("../controller/feedback");
const feedbackRouter = express.Router();

feedbackRouter.post("/create", feedbackController.create);

module.exports = feedbackRouter;

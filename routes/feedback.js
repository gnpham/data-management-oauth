const express = require("express");
const feedbackRouter = express.Router();
const feedbackController = require("../controllers/feedback");

feedbackRouter.get("/", feedbackController.index);
feedbackRouter.get("/:id", feedbackController.detail);
feedbackRouter.delete("/delete-all/:id", feedbackController.deleteAll);
feedbackRouter.post("/fixed/:id/:status", feedbackController.fixed);
feedbackRouter.delete("/delete/:id", feedbackController.deleteOne);

module.exports = feedbackRouter;

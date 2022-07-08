const express = require("express");
const recordActionController = require("../controller/record-action");
const recordActionRouter = express.Router();

recordActionRouter.post("/create", recordActionController.create);

module.exports = recordActionRouter;

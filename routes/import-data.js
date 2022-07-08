const express = require("express");
const dataController = require("../controllers/import-data");
const dataRouter = express.Router();
const importDataMiddleware = require("../middlewares/import-data");
const markUpdatedMid = require("../middlewares/mark-updated");

dataRouter.get("/", markUpdatedMid.markUpdated, dataController.index);
dataRouter.post(
  "/import",
  importDataMiddleware.cleanDataDir,
  dataController.import
);

module.exports = dataRouter;

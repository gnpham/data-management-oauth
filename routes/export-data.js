const express = require("express");
const exportDataController = require("../controllers/export-data");
const exportDataMiddleware = require("../middlewares/export-data");
const dataRouter = express.Router();

dataRouter.get(
  "/",
  exportDataMiddleware.cleanDataDir,
  exportDataController.export
);

dataRouter.get("/download", exportDataController.download);
dataRouter.post("/update-version", exportDataController.updateVersion);

module.exports = dataRouter;

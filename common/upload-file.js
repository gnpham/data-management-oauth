const util = require("util");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "json-input/");
  },
  filename: function (req, file, callback) {
    if (file.mimetype !== "application/json") {
      const errorMess = `File ${file.originalname} is invalid, only json files are allowed`;
      return callback(errorMess, null);
    }
    callback(null, file.originalname);
  },
});

const filesUpload = multer({ storage: storage }).array("files", 100);
const multiFilesUpload = util.promisify(filesUpload);

module.exports = multiFilesUpload;

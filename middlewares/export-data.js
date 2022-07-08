const fsPromises = require("fs").promises;
const fs = require("fs");

const directory = "json-output/";
module.exports.cleanDataDir = async (req, res, next) => {
  if (fs.existsSync(directory)) {
    await fsPromises.rmdir(directory, {
      recursive: true,
    });
  }

  fs.mkdirSync(directory);

  // set markUpdated to false
  req.app.locals.markUpdated = false;

  next();
};

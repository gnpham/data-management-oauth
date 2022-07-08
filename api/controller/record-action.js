const RecordAction = require("../../models/record-action");

// Create record actions
module.exports.create = async (req, res) => {
  try {
    const recordAction = await RecordAction.create(req.body);
    res.json(recordAction);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Please enter required fields",
    });
  }
};

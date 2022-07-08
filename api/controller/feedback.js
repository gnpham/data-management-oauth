const Feedback = require("../../models/feedback");

// Create feedback
module.exports.create = async (req, res) => {
  const lastFeedback = await Feedback.findOne({}, {}, { sort: { id: -1 } });
  req.body.id = lastFeedback ? parseInt(lastFeedback["id"]) + 1 : 1;
  req.body.fixed = false;
  try {
    const feedback = await Feedback.create(req.body);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({
      message: "Please enter required fields",
    });
  }
};

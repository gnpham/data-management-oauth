module.exports.markUpdated = (req, res, next) => {
  if (!req.app.locals.markUpdated) {
    res.redirect("/export-files");
    return;
  }
  next();
};

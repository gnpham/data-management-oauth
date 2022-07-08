const User = require("../models/user");

module.exports.addInfor = async (req, res, next) => {
    const user = await User.findOne({ email: req.session.passport.user });
    if(!user) {
        res.redirect("/");
        return;
    }
    res.locals.user = user;
    req.userInfor = user;
    next();
}
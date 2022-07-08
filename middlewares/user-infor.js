const User = require("../models/user");

module.exports.addInfor = async (req, res, next) => {
    try {
        const email = req.session.passport.user;
        const user = await User.findOne({ email: req.session.passport.user });
    } catch(err) {
        res.redirect("/");
        return;
    }
    if(!user) {
        res.redirect("/");
        return;
    }
    res.locals.user = user;
    req.userInfor = user;
    next();
}
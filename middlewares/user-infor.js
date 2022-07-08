const User = require("../models/user");

module.exports.addInfor = async (req, res, next) => {
    let email = "";
    try {
        email = req.session.passport.user;
    } catch(err) {
        res.redirect("/");
        return;
    }
    const user = await User.findOne({ email: email });
    if(!user) {
        res.redirect("/");
        return;
    }
    res.locals.user = user;
    req.userInfor = user;
    next();
}
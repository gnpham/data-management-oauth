module.exports.isAdmin = (req, res, next) => {
    if(req.userInfor.role > 1) {
        res.redirect("/logout");
        return;
    }
    next();
}
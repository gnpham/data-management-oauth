const User = require("../models/user");

module.exports.index = (req, res) => {
    res.render("authentication/login")
}

// Sign out
module.exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}

// Register new user
module.exports.register = async (req, res) => {
    const user = await User.findOne({ email: req.body.registerEmail });
    if(user) {
        res.end();
        return;
    }

    const newUser = new User();
    newUser.username = req.body.registerUsername;
    newUser.email = req.body.registerEmail;
    newUser.password = newUser.encryptPassword(req.body.registerPass);
    newUser.phoneNumber = req.body.registerPhonenumber;
    newUser.role = 2;
    newUser.save(function(err, result){
        if(err){
            res.end();
        }
        res.end('{"status" : 200}');
      })
}

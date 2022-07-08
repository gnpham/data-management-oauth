const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 5;
const salt = bcrypt.genSaltSync(saltRounds);

const userSchema = new mongoose.Schema(
    {
        id: String,
        username: String,
        email: String,
        password: String,
        phoneNumber: String,
        role: Number,
    },
    { versionKey: false }
);

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, salt);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("User", userSchema, "user");
module.exports = User;
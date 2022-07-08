const User = require("../models/user");
const PAGE_SIZE = 4;

module.exports.index = async (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const numberSkips = (currentPage - 1) * PAGE_SIZE;
    const users = await User.find({}).skip(numberSkips).limit(PAGE_SIZE);
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

    res.render("users/index", { users, currentPage, totalPages});
}
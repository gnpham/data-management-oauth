const userController = require("../controllers/user");
const express = require("express");
const userRouter = express.Router();

userRouter.get("/", userController.index);

module.exports = userRouter;


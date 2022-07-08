const passport = require("passport"); 
const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authentication");

authRouter.get("/", authController.index);
authRouter.post("/login", passport.authenticate("local", { failureRedirect: "/",
                                                           successRedirect: "/import-data" }));
authRouter.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"]}));
authRouter.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/", 
                                                                              successRedirect: "/import-data" }));
authRouter.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"]}));
authRouter.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/", 
                                                                              successRedirect: "/import-data" }));
authRouter.get("/logout", authController.logout);
authRouter.post("/register", authController.register);

module.exports = authRouter;
const passport = require("passport");
const LocalStratery= require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;


const User = require("../models/user");
const config = require("./auth");

// Local stratery
passport.use(new LocalStratery({
  usernameField: "email",
  passwordField: "password"
}, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if(err) return done(err);
    if(!user) return done(null, false);
    if(!user.validPassword(password)) {
      return done(null, false);
    }
    return done(null, user);
  })
}));

// Facebook stratery
passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL,
    profileFields: ["email", "gender", "locale", "displayName"]
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ email : profile._json.email }, (err, user) => {
        if(err) return done(err);
        if(user) return done(null, user);
        const newUser = new User({
          username: profile.displayName,
          email: profile._json.email,
          password: "",
          phoneNumber: "",
          role: 2
        })
  
        newUser.save((err) => {
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
      });
    }
  ));

  // Google stratery
  passport.use(new GoogleStrategy({
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret,
    callbackURL: config.googleAuth.callbackURL,
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOne({ email : profile.email }, (err, user) => {
      if(err) return done(err);
      if(user) return done(null, user);
      const newUser = new User({
        username: profile.displayName,
        email: profile.email,
        password: "",
        phoneNumber: "",
        role: 2
      })

      newUser.save((err) => {
          if(err){
              return done(err);
          }
          return done(null, newUser);
      });
    });
  }
));
  
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });
  
  passport.deserializeUser((email, done) => {
    User.findOne({email}, (err, user) => {
      done(null, user);
    });
  })
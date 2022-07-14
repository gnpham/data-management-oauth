require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const authRouter = require("./routes/authentication");
const userRouter= require("./routes/user")
const topicRouter = require("./routes/topic");
const questionRouter = require("./routes/question");
const importDataRouter = require("./routes/import-data");
const modifiedQuesRouter = require("./routes/modified-question");
const exportRouter = require("./routes/export-data");
const feedbackRouter = require("./routes/feedback");
const apiFeedbackRouter = require("./api/routes/feedback");
const apiRecordActionRouter = require("./api/routes/record-action");

const markUpdatedMidd = require("./middlewares/mark-updated");
const userInforMidd =  require("./middlewares/user-infor");
const roleMidd = require("./middlewares/role");

const app = express();
const port = process.env.PORT || 8080;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
} catch(e) {
  console.log("could not connect");
}

app.use(session({
  secret: 'kcmdatamanagement',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000*60*10,
    secure: false 
}
}))

// Declare passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/import-data", userInforMidd.addInfor, importDataRouter);
app.use("/topics", userInforMidd.addInfor, markUpdatedMidd.markUpdated, topicRouter);
app.use("/questions", userInforMidd.addInfor, markUpdatedMidd.markUpdated, questionRouter);
app.use("/modified-questions", userInforMidd.addInfor, markUpdatedMidd.markUpdated, modifiedQuesRouter);
app.use("/export-files", userInforMidd.addInfor, exportRouter);
app.use("/feedbacks", userInforMidd.addInfor, markUpdatedMidd.markUpdated, feedbackRouter);
app.use("/users", userInforMidd.addInfor, roleMidd.isAdmin, userRouter);

app.use("/api/feedback", apiFeedbackRouter);
app.use("/api/record-action", apiRecordActionRouter);

require("./config/passport");

app.locals.markUpdated = true;

app.listen(port, () => {
  console.log("Your app running on port " + port);
});

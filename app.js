var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var dishesRouter = require("./routes/dishes");
var menusRouter = require("./routes/menus");
var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");

var app = express();

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb+srv://tomas:123@paw.somldg8.mongodb.net/paw", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/dishes", dishesRouter);
app.use("/menus", menusRouter);
app.use("/admin", adminRouter);
app.use("/users", usersRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
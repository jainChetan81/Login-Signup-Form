const express = require("express"),
    app = express(),
    passport = require("passport"),
    session = require("express-session"),
    localUserRoutes = require("./controller/localuser.routes"),
    mongoose = require("mongoose"),
    port = process.env.port || 3000,
    key = require("./key"),
    bodyparser = require("body-parser"),
    createError = require("http-errors"),
    path = require("path"),
    cookieParser = require("cookie-parser"),
    logger = require("morgan");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: key.secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.json());
app.use(
    bodyparser.urlencoded({
        extended: true
    })
);

mongoose.connect(key.mongo);
app.get("/", (req, res) => {
    res.render("index");
});

app.use("/auth/localuser", localUserRoutes);

app.get("/homepage", (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else if (req.session.localUser) {
        res.send(req.session.localUser);
    } else {
        res.redirect("/");
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;

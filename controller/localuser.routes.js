const Router = require("express").Router(),
    User = require("../models/user.model"),
    bcrypt = require("bcrypt"),
    salt = bcrypt.genSaltSync(10);

Router.post("/new", (req, res) => {
    let errors = [];
    let usernameIsGood = req.body.username.length > 0;
    let passwordIsGood = req.body.password.length > 0;
    let emailIsGood = req.body.email.length > 0;
    if (!usernameIsGood) errors.push("username field must be filled");
    if (!passwordIsGood) errors.push("password field must be filled");
    if (!emailIsGood) errors.push("username field must be filled");
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                usernameAlreadyChosen = true;
                errors.push("username", req.body.username, "is already in use");
            } else {
                usernameAlreadyChosen = false;
            }
        }) //end of then
        .then(() => {
            if (errors.length > 0) {
                res.render("index", { errors });
            } else {
                let newuser = new User();
                newuser.username = req.body.username;
                newuser.password = bcrypt.hashSync(req.body.password, salt);
                newuser.save((err, user) => {
                    if (err) {
                        console.warn("error in signup redirect");
                    }
                    req.session.localUser = user;
                    console.log(user + "      : this guy huh?");
                    res.redirect("/homepage");
                });
            }
        }); //end of then
});

Router.post("/login", (req, res) => {
    let errors = [];
    User.find({
        username: req.body.username
    })
        .then(user => {
            let userExists = user;
            if (
                userExists &&
                bcrypt.compareSync(req.body.password, user.password) === true
            ) {
                req.session.user = user;
                res.redirect("/dashboard");
            } else {
                errors.push("could not log in");
                res.render("index", { errors });
            }
        })
        .catch(err => {
            errors.push("user does not exist");
            console.log(err);
            res.render("index", { errors });
        });
});
module.exports = Router;

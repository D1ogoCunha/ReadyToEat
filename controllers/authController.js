const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../jwt_secret/config");
const bcrypt = require("bcryptjs");

let authController = {};

authController.login = function (req, res, next) {
    res.render("login");
};

authController.submittedLogin = function (req, res, next) {
    const emailInput = req.body.email;
    const passwordInput = req.body.password;

    User.findOne({ email: emailInput })
        .then(function (user) {
            if (!user) {
                console.log("User not found:", emailInput);
                return res.redirect("/login");
            }

            bcrypt.compare(passwordInput, user.password)
                .then(function (result) {
                    if (result === true) {
                        const authToken = jwt.sign({ email: user.email, role: user.role }, config.secret, { expiresIn: 86400 });
                        res.cookie("auth-token", authToken, { maxAge: 82000 });

                        if (user.role === "restaurant") {
                            res.redirect("/menus");
                        } else if (user.role === "customer") {
                            res.redirect("/index");
                        } else {
                            res.redirect("/admin");
                        }
                    } else {
                        console.log("Wrong password:", emailInput);
                        res.redirect("/login");
                    }
                });
        })
        .catch(function (err) {
            next(err);
        });
};

authController.createLogin = function (req, res, next) {
    res.render("register");
};

authController.createLoginSubmitted = function (req, res, next) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    req.body.password = hashedPassword;

    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
    };

    if (req.body.role === "restaurant") {
        userData.restaurantName = req.body.restaurantName;
        userData.address = req.body.address;
        userData.phone = req.body.phone;
        userData.pricePerPerson = req.body.pricePerPerson;
    }

    User.create(userData)
        .then(function () {
            res.redirect("/login");
        })
        .catch(function (err) {
            next(err);
        });
};

authController.verifyLoginUser = function (req, res, next) {
    const authToken = req.cookies["auth-token"];
    if (authToken) {
        jwt.verify(authToken, config.secret, function (err, decoded) {
            if (err) {
                console.log("Error verifying token:", err);
                return res.redirect("/login");
            }
            req.userEmail = decoded.email;
            req.userRole = decoded.role;
        });
    } else {
        res.redirect("/login");
    }
};

authController.logout = function (req, res, next) {
    res.clearCookie("auth-token");
    res.redirect("/");
};

module.exports = authController;
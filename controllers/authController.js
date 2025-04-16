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
                return res.render("login", { errorMessage: "Invalid email or password." });
            }

            bcrypt.compare(passwordInput, user.password)
                .then(function (result) {
                    if (!result) {
                        console.log("Wrong password:", emailInput);
                        return res.render("login", { errorMessage: "Invalid email or password." });
                    }

                    if (user.role === "restaurant" && user.status === "in validation") {
                        console.log("Restaurant not validated:", emailInput);
                        return res.render("login", { errorMessage: "Your account is under validation. Please wait for approval." });
                    }

                    const authToken = jwt.sign(
                        { email: user.email, role: user.role },
                        config.secret,
                        { expiresIn: 86400 }
                    );
                    console.log("Generated Token:", authToken);
                    res.cookie("auth-token", authToken, { maxAge: 86400000, httpOnly: true });

                    if (user.role === "restaurant") {
                        res.redirect("/menus");
                    } else if (user.role === "customer") {
                        res.redirect("/index");
                    } else {
                        res.redirect("/admin");
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
    const authToken = req.cookies['auth-token'];
    if (authToken) {
        jwt.verify(authToken, config.secret, async function (err, decoded) {
            if (err) {
                console.log('Error verifying token:', err);
                return res.redirect('/login');
            }
            try {
                const user = await User.findOne({ email: decoded.email });
                if (!user) {
                    return res.redirect('/login');
                }
                req.user = user; 
                next();
            } catch (error) {
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/login');
    }
};

authController.logout = function (req, res, next) {
    res.clearCookie("auth-token");
    res.redirect("/login");
};

authController.verifyAdmin = function (req, res, next) {
    authController.verifyLoginUser(req, res, function () {
        if (req.user && req.user.role === "admin") {
            return next(); 
        }
        console.log("Access denied. User is not an admin:", req.user.email);
        res.status(403).render("error", { 
            message: "Access denied. Admins only.", 
            error: { status: 403, stack: "" } 
        }); 
    });
};
module.exports = authController;
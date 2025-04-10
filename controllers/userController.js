const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

var userController = {};

userController.show = function (req, res) {
    User.findOne({ _id: req.params.id }).exec(function (err, user) {
        if (err) {
            console.log("Error retrieving user:", err);
        } else {
            res.render("../views/user/show", { user: user });
        }
    });
};

/*userController.save = async function (req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        var user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        await user.save();
        console.log("User salvo com sucesso:", user);
        res.redirect("/index");
    } catch (err) {
        console.log("Erro ao salvar User:", err);
        res.status(500).send("Erro ao registrar. Tente novamente.");
    }
};
*/
userController.edit = function (req, res) {
    User.findOne({ _id: req.params.id }).exec(function (err, user) {
        if (err) {
            console.log("Error retrieving user:", err);
        } else {
            res.render("../views/user/edit", { user: user });
        }
    });
};

userController.update = function (req, res) {
    User.findOne({ _id: req.params.id }).exec(function (err, user) {
        if (err) {
            console.log("Error retrieving user:", err);
        } else {
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;

            user.save(function (err) {
                if (err) {
                    console.log("Error saving user:", err);
                } else {
                    res.redirect("/users/" + user._id);
                }
            });
        }
    });
};

userController.delete = function (req, res) {
    User.findOneAndDelete({ _id: req.params.id }).exec(function (err, user) {
        if (err) {
            console.log("Error deleting user:", err);
        } else {
            res.redirect("/users");
        }
    });
};

module.exports = userController;
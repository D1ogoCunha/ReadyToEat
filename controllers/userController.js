var mongoose = require("mongoose");
var User = require("../models/user");
const bcrypt = require("bcrypt");

var userController = {}

userController.show = function (req, res) {
    user.findOne({ _id: req.params.id }).exec(function (err, user) {
        if (err) {
            console.log("Error retrieving user:", err);
        } else {
            res.render("../views/user/show", {user: user});
        }
    });
};

userController.save = async function (req, res) {
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

userController.edit = function (req, res) {
    user.findOne({ _id: req.params.id }).exec(function (err, user) {
        if (err) {
            console.log("Error retrieving user:", err);
        } else {
            res.render("../views/user/edit", {user: user});
        }
    });
};

userController.update = function (req, res) {
    user.findOne({ _id: req.params.id }).exec(function (err, user) {
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
}

userController.delete = function (req, res) {
    user.findOneAndDelete({ _id: req.params.id }).exec(function (err, user) {
        if (err) {
            console.log("Error deleting user:", err);
        } else {
            res.redirect("/users");
        }
    });
};

userController.login = async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await user.findOne({ email: email });

        if (!user) {
            console.log("usere não encontrado:", email);
            return res.status(401).send("Email ou senha inválidos.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Senha incorreta para o user:", email);
            return res.status(401).send("Email ou senha inválidos.");
        }

        console.log("Login realizado com sucesso:", user);
        res.redirect("/index");
    } catch (error) {
        console.error("Erro ao processar login:", error);
        res.status(500).send("Erro ao processar login. Tente novamente.");
    }
};



module.exports = userController;

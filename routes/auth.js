var express = require('express');
var router = express.Router();
var userController = require("../controllers/userController"); 

// Rota para exibir o formulário de registro
router.get("/register", function (req, res, next) {
  res.render("register");
});

// Rota para processar o formulário de registro
router.post("/register", userController.save); 

// Rota para exibir o formulário de login
router.get("/login", function (req, res, next) {
  res.render("login");
});

// Rota para processar o formulário de login
router.post("/login", userController.login);

module.exports = router;
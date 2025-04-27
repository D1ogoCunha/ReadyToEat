var express = require('express');
var router = express.Router();
var authController = require("../controllers/authController");

router.get("/register", authController.createLogin);

router.post("/register", authController.createLoginSubmitted);

router.get("/login", authController.login);

router.post("/login", authController.submittedLogin);

router.get("/logout", authController.logout);

module.exports = router;
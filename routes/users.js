var express = require('express');
var router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.get("/profile", authController.verifyLoginUser, userController.renderProfilePage);
router.get("/profile/edit", authController.verifyLoginUser, userController.renderEditProfilePage);
router.post("/profile/update", authController.verifyLoginUser, userController.updateProfile);


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

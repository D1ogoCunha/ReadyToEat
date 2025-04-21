var express = require('express');
var router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");


router.get("/profile/security", authController.verifyLoginUser, userController.renderSecurityProfilePage);
router.post("/profile/security", authController.verifyLoginUser, userController.updatePassword);

router.get("/profile/edit", authController.verifyLoginUser, userController.renderProfilePage);
router.post("/profile/edit", authController.verifyLoginUser, userController.updateProfile);

router.get("/profile/chart", authController.verifyLoginUser, userController.renderChartPage);
router.post("/profile/chart", authController.verifyLoginUser, userController.getMostOrderedDishes);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

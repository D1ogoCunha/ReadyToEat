const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

router.get('/phone', authController.verifyLoginUser, orderController.renderPhoneOrderPage);
router.post('/phone', authController.verifyLoginUser, orderController.createPhoneOrder);
router.get('/', authController.verifyLoginUser, orderController.getOrderHistory);

module.exports = router;
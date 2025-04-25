const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

/*router.get("/", authController.verifyLoginUser, orderController.renderOrderPage);
router.get("/phone", authController.verifyLoginUser, orderController.renderPhoneOrderPage);
router.post("/phone", authController.verifyLoginUser, orderController.createPhoneOrder);
router.get("/history", authController.verifyLoginUser, orderController.getOrderHistory);
*/

router.use(authController.verifyLoginUser); // aplica a todas as rotas deste router

//router.get('/', orderController.renderOrderPage);
router.get('/phone', orderController.renderPhoneOrderPage);
router.post('/phone', orderController.createPhoneOrder);
router.get('/', orderController.getOrderHistory);


module.exports = router;
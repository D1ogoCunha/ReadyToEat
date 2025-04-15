const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

// Protege todas as rotas do admin
router.get("/admin", authController.verifyAdmin, adminController.getAdminDashboard);

router.delete("/restaurants/:id", authController.verifyAdmin, adminController.deleteRestaurant);

router.get("/restaurants/:id/edit", authController.verifyAdmin, adminController.getEditRestaurant);

router.post("/restaurants/:id/edit", authController.verifyAdmin, adminController.postEditRestaurant);

router.get("/admin/addNewRestaurant", authController.verifyAdmin, adminController.getAddNewRestaurant);

router.post("/admin/addNewRestaurant", authController.verifyAdmin, adminController.postAddNewRestaurant);

router.get("/admin/pending", authController.verifyAdmin, adminController.getPendingRestaurants);

module.exports = router;
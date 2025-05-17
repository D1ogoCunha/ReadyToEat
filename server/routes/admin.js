const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

router.get("/", authController.verifyAdmin, adminController.getAdminDashboard);

router.get("/restaurantManagement", authController.verifyLoginUser, adminController.getRestaurantManagement);

router.delete("/restaurants/:id", authController.verifyAdmin, adminController.deleteRestaurant);

router.get("/restaurants/restaurant/edit", authController.verifyAdmin, adminController.getEditRestaurant);

router.post("/restaurants/restaurant/edit", authController.verifyAdmin, adminController.postEditRestaurant);

router.get("/addNewRestaurant", authController.verifyAdmin, adminController.getAddNewRestaurant);

router.post("/addNewRestaurant", authController.verifyAdmin, adminController.postAddNewRestaurant);

router.get("/pending", authController.verifyAdmin, adminController.getPendingRestaurants);

router.post("/validate/restaurant", authController.verifyAdmin, adminController.validateRestaurant);

router.get("/analytics", authController.verifyAdmin, adminController.getAnalytics);

router.get("/analytics2", authController.verifyAdmin, adminController.getAnalytics2);

module.exports = router;
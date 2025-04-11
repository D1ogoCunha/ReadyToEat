const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/admin", adminController.getAdminDashboard);

router.delete("/restaurants/:id", adminController.deleteRestaurant);

router.get("/restaurants/:id/edit", adminController.getEditRestaurant);

router.post("/restaurants/:id/edit", adminController.postEditRestaurant);

router.get("/admin/addNewRestaurant", adminController.getAddNewRestaurant);

router.post("/admin/addNewRestaurant", adminController.postAddNewRestaurant);

module.exports = router;
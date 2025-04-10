const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/admin", adminController.getAdminDashboard);

router.delete("/restaurants/:id", adminController.deleteRestaurant);

router.get("/restaurants/:id/edit", adminController.getEditRestaurant);

router.post("/restaurants/:id/edit", adminController.postEditRestaurant);

module.exports = router;
var express = require("express");
var router = express.Router();
var dishController = require("../controllers/dishController");
var authController = require("../controllers/authController");
const Dish = require("../models/dish");

router.get("/", dishController.list);

router.get("/add", dishController.addForm);

router.post("/add", dishController.upload.single("image"), dishController.save);

router.get("/:id/edit", dishController.editForm);

router.post("/:id", dishController.upload.single("image"), dishController.update);

router.post("/:id/delete", dishController.deleteDish);

router.get("/:id", authController.verifyLoginUser, dishController.getDishDetails);

module.exports = router;

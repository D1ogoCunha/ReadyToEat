var express = require("express");
var router = express.Router();
var dishController = require("../controllers/dishController");
var authController = require("../controllers/authController");
const Dish = require("../models/dish");

router.get("/", authController.verifyLoginUser, dishController.list);

router.get("/add", dishController.addForm);

router.post("/add", dishController.upload.single("image"), dishController.save);

router.get("/edit", authController.verifyLoginUser, dishController.editForm);

router.post("/edit", dishController.upload.single("image"), dishController.update);

router.post("/:id/delete", dishController.deleteDish);

router.get("/dish", authController.verifyLoginUser, dishController.getDishDetails);

module.exports = router;

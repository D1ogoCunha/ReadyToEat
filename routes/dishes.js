var express = require("express");
var router = express.Router();
var dishController = require("../controllers/dishController");

router.get("/", dishController.list);

router.get("/add", dishController.addForm);

router.post("/add", dishController.upload.single("imagem"), dishController.save);

module.exports = router;
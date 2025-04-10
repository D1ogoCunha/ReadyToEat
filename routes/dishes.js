var express = require("express");
var router = express.Router();
var dishController = require("../controllers/dishController");

router.get("/", dishController.list);

router.get("/add", dishController.addForm);

router.post("/add", dishController.upload.single("image"), dishController.save);

router.get("/:id/edit", dishController.editForm);
router.post("/:id", dishController.upload.single("image"), dishController.update);

module.exports = router;
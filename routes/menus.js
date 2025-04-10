const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const menuController = require("../controllers/menuController");
const dishController = require("../controllers/dishController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/new", menuController.renderNewMenuForm);
router.post("/", upload.single("image"), menuController.createMenu);
router.get("/", menuController.getAllMenus);
router.get("/dishes", menuController.getMenuDishes);

router.get("/:id/edit", menuController.renderEditMenuForm);
router.post("/:id/edit", upload.single("image"), menuController.updateMenu);

module.exports = router;
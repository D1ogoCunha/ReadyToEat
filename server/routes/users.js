var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get(
  "/profile/security",
  authController.verifyLoginUser,
  userController.renderSecurityProfilePage
);
router.post(
  "/profile/security",
  authController.verifyLoginUser,
  userController.updatePassword
);

router.get(
  "/profile/edit",
  authController.verifyLoginUser,
  userController.renderProfilePage
);
router.post(
  "/profile/edit",
  authController.verifyLoginUser,
  upload.single("profileImage"),
  userController.updateProfile
);

router.get(
  "/profile/chart",
  authController.verifyLoginUser,
  userController.renderChartPage
);

router.post(
  "/profile/chart",
  authController.verifyLoginUser,
  userController.getMostOrderedDishes
);

router.post(
  "/profile/chart/restaurant",
  authController.verifyLoginUser,
  userController.getMostOrderedDishesByRestaurant
);

/**
 * @swagger
 * /users/restaurants:
 *   get:
 *     summary: Get all valid restaurants
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/restaurants",
  authController.verifyLoginUser,
  userController.getRestaurants
);

/**
 * @swagger
 * /users/restaurants/{restaurantId}:
 *   get:
 *     summary: Get restaurant details by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Restaurant not found
 */
router.get(
  "/restaurants/:restaurantId",
  authController.verifyLoginUser,
  userController.getRestaurantesById
);

/**
 * @swagger
 * /users/restaurants/{restaurantId}/menus:
 *   get:
 *     summary: Get menus for a restaurant
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: List of menus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Menus not found
 */
router.get(
  "/restaurants/:restaurantId/menus",
  authController.verifyLoginUser,
  userController.getMenusByRestaurantId
);

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

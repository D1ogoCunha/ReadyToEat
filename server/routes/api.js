const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Menu = require("../models/menu");
const Dish = require("../models/dish");
const Order = require("../models/order");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const config = require("../jwt_secret/config");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController"); 

// Profile REST API routes
router.get('/profile', authController.verifyLoginUser, userController.getProfile);
router.put('/profile', authController.verifyLoginUser, userController.updateProfileRest);
router.put('/profile/password', authController.verifyLoginUser, userController.changePassword);
router.get('/profile/charts', authController.verifyLoginUser, userController.getMostOrderedDishes);

router.post('/orders', async (req, res) => {
  try {
    const { restaurantId, customerId, amount, dishes } = req.body;
    if (!restaurantId || !customerId || !amount || !dishes || !dishes.length) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const order = new Order({
      restaurantId,
      customerId,
      amount,
      dishes,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/*
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    if (user.role === "restaurant" && user.status === "in validation") {
      return res.status(403).json({
        error: "Your account is under validation. Please wait for approval.",
      });
    }
    const token = jwt.sign(
      { email: user.email, role: user.role },
      config.secret,
      { expiresIn: 86400 }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});*/



module.exports = router;

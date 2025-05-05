const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Menu = require("../models/menu");
const Dish = require("../models/dish");

router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await User.find({ role: "restaurant" });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

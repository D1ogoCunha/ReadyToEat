const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Menu = require("../models/menu");
const Dish = require("../models/dish");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const config = require("../jwt_secret/config"); 

router.post("/login", async (req, res) => {
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
});

router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await User.find({ role: "restaurant" });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/api/restaurants/:restaurantId/menus", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    console.log("Restaurant ID recebido:", restaurantId); // Log para depuração
    const menus = await Menu.find({
      createdBy: new mongoose.Types.ObjectId(restaurantId),
    }); // Certifique-se de usar ObjectId
    console.log("Menus found:", menus); // Log para depuração
    res.json(menus);
  } catch (error) {
    console.error("Error searching for menus:", error);
    res.status(500).json({ message: "Error searching for menus." });
  }
});

router.get("/api/menus/:menuId/dishes", async (req, res) => {
  try {
    const { menuId } = req.params;
    console.log("Menu ID recebido:", menuId);
    const dishes = await Dish.find({ menu: menuId });
    console.log("Dishes found:", dishes);
    res.json(dishes);
  } catch (error) {
    console.error("Error searching for dishes:", error);
    res.status(500).json({ message: "Error searching for dishes." });
  }
});

router.get("/api/dishes/:dishId", async (req, res) => {
  try {
    const { dishId } = req.params;
    console.log("Dish ID recebido:", dishId); // Log para depuração

    const dish = await Dish.findById(dishId);

    if (!dish) {
      console.log("Dish not found for ID:", dishId);
      return res.status(404).json({ message: "Dish not found" });
    }

    console.log("Dish not found:", dish);
    res.json(dish);
  } catch (error) {
    console.error("Error searching for dish:", error);
    res.status(500).json({ message: "Error searching for dish:" });
  }
});

module.exports = router;

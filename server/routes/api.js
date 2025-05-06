const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Menu = require("../models/menu");
const Dish = require("../models/dish");
const mongoose = require("mongoose");

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
    console.log('Restaurant ID recebido:', restaurantId); // Log para depuração
    const menus = await Menu.find({ createdBy: new mongoose.Types.ObjectId(restaurantId) }); // Certifique-se de usar ObjectId
    console.log('Menus encontrados:', menus); // Log para depuração
    res.json(menus);
  } catch (error) {
    console.error('Erro ao buscar menus:', error);
    res.status(500).json({ message: 'Erro ao buscar menus.' });
  }
});

router.get('/api/menus/:menuId/dishes', async (req, res) => {
  try {
    const { menuId } = req.params;
    console.log('Menu ID recebido:', menuId); 
    const dishes = await Dish.find({ menu: menuId });
    console.log('Pratos encontrados:', dishes);
    res.json(dishes);
  } catch (error) {
    console.error('Erro ao buscar pratos:', error);
    res.status(500).json({ message: 'Erro ao buscar pratos.' });
  }
});

module.exports = router;

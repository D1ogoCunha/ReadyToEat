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
const menuController = require("../controllers/menuController");

// Profile REST API routes
router.get('/profile', authController.verifyLoginUser, userController.getProfile);
router.put('/profile', authController.verifyLoginUser, userController.updateProfileRest);
router.put('/profile/password', authController.verifyLoginUser, userController.changePassword);
router.get('/profile/charts', authController.verifyLoginUser, userController.getMostOrderedDishes);


router.get('/orders', async (req, res) => {
  const { customerId } = req.query;
  if (!customerId) return res.status(400).json({ error: 'Missing customerId' });
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ error: 'Invalid customerId' });
  }

  try {
    const orders = await Order.find({ customerId: new mongoose.Types.ObjectId(customerId) })
      .populate('restaurantId')
      .populate('dishes');
    res.json(orders);
  } catch (err) {
    console.error('Erro ao buscar encomendas:', err); // <-- Isto mostra o erro real
    res.status(500).json({ error: err.message });
  }
});
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

router.get('/:menuId', menuController.getMenuById);
router.get("/:menuId/dishes", authController.verifyLoginUser, menuController.getDishesByMenuId);




module.exports = router;

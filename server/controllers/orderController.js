const Order = require("../models/order");
const User = require("../models/user");
const Dish = require("../models/dish");
const Menu = require("../models/menu");

const orderController = {};

orderController.getOrderHistory = async (req, res) => {
  try {
    let populatedOrders = [];

    if (req.user.role === "restaurant") {
      populatedOrders = await Order.find({ restaurantId: req.user._id })
        .populate("customerId", "firstName lastName nif")
        .populate("dishes")
        .sort({ date: 1 });
    } else if (req.user.role === "customer") {
      populatedOrders = await Order.find({ customerId: req.user._id })
        .populate("restaurantId", "restaurantName")
        .populate("dishes")
        .sort({ date: 1 });
    }

    let customers = [];
    let menus = [];
    if (req.user.role === "restaurant") {
      customers = await User.find({ role: "customer" });
      menus = await Menu.find({ createdBy: req.user._id });

      const menuIds = menus.map((menu) => menu._id);
      const dishes = await Dish.find({ menu: { $in: menuIds } });

      menus.forEach((menu) => {
        menu.dishes = dishes.filter(
          (dish) => String(dish.menu) === String(menu._id)
        );
      });
    }

    res.render("order/orderHistory", {
      orders: populatedOrders || [],
      user: req.user,
      customers,
      menus,
    });
  } catch (error) {
    console.error("Error fetching order history:", error.stack);
    res.status(500).send("Error fetching order history: " + error.message);
  }
};

orderController.renderOrderPage = async (req, res) => {
  try {
    if (!req.user) {
      console.error("User is not authenticated");
      return res.redirect("/login");
    }

    const query =
      req.user.role === "restaurant"
        ? { restaurantId: req.user._id }
        : { customerId: req.user._id };

    const orders = await Order.find(query);

    res.render("order/orderHistory", { orders, user: req.user });
  } catch (error) {
    console.error("Error fetching order history:", error.stack);
    res.status(500).send("Error fetching order history: " + error.message);
  }
};

orderController.createPhoneOrder = async (req, res) => {
  try {
    const { customerId, selectedDishes } = req.body;

    const dishIds = Array.isArray(selectedDishes)
      ? selectedDishes
      : [selectedDishes];

    if (dishIds.length === 0) {
      return res.status(400).send("No dishes selected for the order.");
    }

    const dishes = await Dish.find({ _id: { $in: dishIds } });

    if (dishes.length === 0) {
      return res.status(404).send("No dishes found with the provided IDs.");
    }

    const totalAmount = dishes.reduce(
      (sum, dish) => sum + (dish.preco || 0),
      0
    );

    const order = new Order({
      restaurantId: req.user._id,
      customerId,
      date: new Date(),
      amount: totalAmount,
      status: "Pending",
      dishes: dishIds,
    });

    order.save();
    res.redirect("/order");
  } catch (error) {
    console.error("Error creating phone order:", error.stack);
    res.status(500).send("Error creating phone order: " + error.message);
  }
};

orderController.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  if (!orderId || !status)
    return res.status(400).json({ error: "Missing data" });
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

orderController.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found." });

    const now = new Date();
    const diffMinutes = (now - order.date) / 60000;
    if (diffMinutes > 5) {
      return res.status(400).json({
        error: "You can only cancel within 5 minutes of placing the order.",
      });
    }

    if (order.status === "Preparing") {
      return res.status(400).json({
        error: "Order is already being prepared and cannot be cancelled.",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = orderController;

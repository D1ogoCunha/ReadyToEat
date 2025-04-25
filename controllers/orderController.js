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
        .populate("customerId", "firstName lastName") // Popula dados do cliente
        .populate("dishes") // Popula dados dos pratos
        .sort({ date: 1 });
    } else if (req.user.role === "customer") {
      populatedOrders = await Order.find({ customerId: req.user._id })
        .populate("restaurantId", "restaurantName") // Popula nome do restaurante
        .populate("dishes") // Popula dados dos pratos
        .sort({ date: 1 });
    }

    res.render("order/orderHistory", {
      orders: populatedOrders || [],
      user: req.user,
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

orderController.renderPhoneOrderPage = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" });
    const menus = await Menu.find({ createdBy: req.user._id });

    // Obter todos os pratos cujos menus estejam nos menus do user
    const menuIds = menus.map((menu) => menu._id);
    const dishes = await Dish.find({ menu: { $in: menuIds } });

    // Agrupar pratos por menuId
    const dishesByMenu = {};
    menus.forEach((menu) => {
      dishesByMenu[menu._id] = {
        menu,
        dishes: dishes.filter((dish) => String(dish.menu) === String(menu._id)),
      };
    });

    // Verificação no console
    console.log("Dishes by Menu:");
    for (const [menuId, group] of Object.entries(dishesByMenu)) {
      console.log(`Menu: ${group.menu.name}`);
      group.dishes.forEach((d) => {
        console.log(`  - ${d.nome} (€${d.preco.toFixed(2)})`);
      });
    }
  
    res.render("order/phoneOrder", {
      customers,
      dishesByMenu,
      user: req.user,
    });
  } catch (error) {
    console.error("Erro ao renderizar página de encomenda telefónica:", error);
    res.status(500).send("Erro ao renderizar página de encomenda telefónica.");
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
    console.log("Found dishes:", dishes.length);

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

    const savedOrder = await order.save();
    console.log("Order created successfully:", savedOrder._id);

    res.redirect("/order");
  } catch (error) {
    console.error("Error creating phone order:", error.stack);
    res.status(500).send("Error creating phone order: " + error.message);
  }
};

module.exports = orderController;

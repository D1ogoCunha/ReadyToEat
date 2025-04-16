const Menu = require("../models/menu");
const Dish = require("../models/dish");
const Order = require("../models/order");
const User = require("../models/user");

var menuController = {};

menuController.renderNewMenuForm = (req, res) => {
  res.render("menu/newMenu");
};

menuController.createMenu = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const menu = new Menu({
      name,
      image,
      createdBy: req.user._id,
    });

    await menu.save();
    res.redirect("/menus");
  } catch (error) {
    console.error("Error creating menu", error);
    res.status(500).send("Error creating menu.");
  }
};

menuController.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find({ createdBy: req.user._id });

    res.render("menu/menus", { menus, user: req.user });
  } catch (error) {
    console.error("Error searching for menus:", error);
    res.status(500).send("Error searching for menus.");
  }
};

menuController.getMenuDishes = async (req, res) => {
  const { menuId } = req.query;

  try {
    const menu = await Menu.findById(menuId);
    const dishes = await Dish.find({ menu: menuId });

    res.render("menu/dishes", { pratos: dishes, menu, user: req.user });
  } catch (error) {
    console.error("Error searching for dishes:", error);
    res.status(500).send("Error searching for dishes.");
  }
};

menuController.renderEditMenuForm = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).send("Menu not found.");
    }
    res.render("menu/editMenu", { menu });
  } catch (error) {
    console.error("Error searching for menu:", error);
    res.status(500).send("Error searching for menu.");
  }
};

menuController.updateMenu = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = { name };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const menu = await Menu.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!menu) {
      return res.status(404).send("Menu not found.");
    }

    res.redirect("/menus");
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).send("Error updating menu:.");
  }
};

menuController.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.redirect("/login");
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.redirect("/login");
  }
};

menuController.renderOrderPage = async (req, res) => {
  try {
    // Adicionar log para verificar o ID do restaurante
    console.log("Restaurant ID:", req.user._id);
    
    // Buscar encomendas com verificação de existência
    const orders = await Order.find({ restaurantId: req.user._id });
    
    // Verificar se existem encomendas antes de popular
    console.log("Orders found (before populate):", orders.length);
    
    if (orders.length === 0) {
      return res.render("menu/orderHistory", { orders: [], user: req.user });
    }
    
    // Popular com a sintaxe correta
    const populatedOrders = await Order.find({ restaurantId: req.user._id })
      .populate("customerId", "firstName lastName") // Popula os dados do cliente
      .populate("dishes") // Popula todos os campos dos pratos
      .sort({ date: -1 });
    
    // Log dos resultados para depuração
    console.log("Populated orders:", JSON.stringify(populatedOrders, null, 2));
    
    // Renderizar com verificação adicional
    res.render("menu/orderHistory", { 
      orders: populatedOrders || [], 
      user: req.user 
    });
  } catch (error) {
    console.error("Error fetching order history:", error.stack);
    res.status(500).send("Error fetching order history: " + error.message);
  }
};


menuController.renderPhoneOrderPage = async (req, res) => {
  try {
    // Buscar todos os clientes e pratos disponíveis
    const customers = await User.find({ role: "customer" }); // Supondo que o campo `role` identifica clientes
    const dishes = await Dish.find();

    res.render("menu/phoneOrder", { customers, dishes, user: req.user });
  } catch (error) {
    console.error("Error rendering phone order page:", error);
    res.status(500).send("Error rendering phone order page.");
  }
};

menuController.createPhoneOrder = async (req, res) => {
  try {
    const { customerId, selectedDishes } = req.body;
    
    // Garantir que selectedDishes seja sempre um array
    const dishIds = Array.isArray(selectedDishes) ? selectedDishes : [selectedDishes];
    
    if (dishIds.length === 0) {
      return res.status(400).send("No dishes selected for the order.");
    }
    
    // Buscar os pratos para calcular o valor total
    const dishes = await Dish.find({ _id: { $in: dishIds } });
    console.log("Found dishes:", dishes.length);
    
    if (dishes.length === 0) {
      return res.status(404).send("No dishes found with the provided IDs.");
    }
    
    const totalAmount = dishes.reduce((sum, dish) => sum + (dish.preco || 0), 0);
    
    // Criar a encomenda com dados válidos
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
    
    res.redirect("/menus/order");
  } catch (error) {
    console.error("Error creating phone order:", error.stack);
    res.status(500).send("Error creating phone order: " + error.message);
  }
};


module.exports = menuController;

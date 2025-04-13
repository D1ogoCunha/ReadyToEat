const Menu = require("../models/menu");
const Dish = require("../models/dish");

exports.renderNewMenuForm = (req, res) => {
  res.render("menu/newMenu");
};

exports.createMenu = async (req, res) => {
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

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find({ createdBy: req.user._id });

    res.render("menu/menus", { menus, user: req.user });
  } catch (error) {
    console.error("Error searching for menus:", error);
    res.status(500).send("Error searching for menus.");
  }
};

exports.getMenuDishes = async (req, res) => {
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

exports.renderEditMenuForm = async (req, res) => {
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

exports.updateMenu = async (req, res) => {
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

exports.authenticate = async (req, res, next) => {
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

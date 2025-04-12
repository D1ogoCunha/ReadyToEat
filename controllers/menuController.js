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
    console.error("Erro ao criar o menu:", error);
    res.status(500).send("Erro ao criar o menu.");
  }
};

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find({ createdBy: req.user._id });

    res.render("menu/menus", { menus, user: req.user });
  } catch (error) {
    console.error("Erro ao buscar os menus:", error);
    res.status(500).send("Erro ao buscar os menus.");
  }
};

exports.getMenuDishes = async (req, res) => {
  const { menuId } = req.query;

  try {
    const menu = await Menu.findById(menuId);
    const dishes = await Dish.find({ menu: menuId });

    res.render("menu/dishes", { pratos: dishes, menu, user: req.user });
  } catch (error) {
    console.error("Erro ao buscar os pratos:", error);
    res.status(500).send("Erro ao buscar os pratos.");
  }
};

exports.renderEditMenuForm = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).send("Menu não encontrado.");
    }
    res.render("menu/editMenu", { menu });
  } catch (error) {
    console.error("Erro ao buscar o menu:", error);
    res.status(500).send("Erro ao buscar o menu.");
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
      return res.status(404).send("Menu não encontrado.");
    }

    res.redirect("/menus");
  } catch (error) {
    console.error("Erro ao atualizar o menu:", error);
    res.status(500).send("Erro ao atualizar o menu.");
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
    console.error("Erro na autenticação:", error);
    res.redirect("/login");
  }
};

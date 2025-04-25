const Menu = require("../models/menu");
const Dish = require("../models/dish");
const Order = require("../models/order");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

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
  const menuId = req.query.menuId || req.cookies.menuId; 

  if (req.query.menuId) {
      res.cookie("menuId", req.query.menuId, { httpOnly: true, secure: false }); 
      return res.redirect("/menus/dishes");
  }

  if (!menuId) {
      return res.status(400).send("Menu ID is required.");
  }

  try {
      const menu = await Menu.findById(menuId);
      const dishes = await Dish.find({ menu: menuId });
      const dishCount = dishes.length;

      res.render("menu/dishes", { pratos: dishes, menu, dishCount, maxDishes: 10, user: req.user });
  } catch (error) {
      console.error("Error searching for dishes:", error);
      res.status(500).send("Error searching for dishes.");
  }
};

menuController.renderEditMenuForm = async (req, res) => {
  const menuId = req.query.menuId || req.cookies.menuId; 

  if (req.query.menuId) {
      res.cookie("menuId", req.query.menuId, { httpOnly: true, secure: false });
      return res.redirect("/menus/edit");
  }

  if (!menuId) {
      return res.status(400).send("Menu ID is required.");
  }

  try {
      const menu = await Menu.findById(menuId);
      if (!menu) {
          return res.status(404).send("Menu not found.");
      }

      res.render("menu/editMenu", { menu });
  } catch (error) {
      console.error("Error rendering edit menu form:", error);
      res.status(500).send("Error rendering edit menu form.");
  }
};

menuController.updateMenu = async (req, res) => {
  const menuId = req.cookies.menuId; 

  if (!menuId) {
      return res.status(400).send("Menu ID is required.");
  }

  try {
      const menu = await Menu.findByIdAndUpdate(menuId, {
          name: req.body.name,
          image: req.file ? `/uploads/${req.file.filename}` : undefined,
      }, { new: true });

      if (!menu) {
          return res.status(404).send("Menu not found.");
      }

      res.redirect("/menus");
  } catch (error) {
      console.error("Error updating menu:", error);
      res.status(500).send("Error updating menu.");
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

menuController.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const dishes = await Dish.find({ menu: id });

    for (const dish of dishes) {
      if (dish.imagem) {
        const imagePath = path.join(__dirname, '..', 'public', dish.imagem);
        try {
          await fs.unlink(imagePath);
          console.log(`Imagem deletada: ${imagePath}`);
        } catch (err) {
          console.error(`Erro ao deletar imagem ${imagePath}:`, err);
        }
      }
    }

    await Dish.deleteMany({ menu: id });

    await Menu.findByIdAndDelete(id);

    console.log(`Menu e pratos associados deletados com sucesso (ID: ${id})`);
    res.redirect("/menus");
  } catch (error) {
    console.error("Erro ao deletar o menu:", error);
    res.status(500).send("Erro ao deletar o menu.");
  }
};


module.exports = menuController;

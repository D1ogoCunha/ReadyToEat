const Menu = require("../models/menu");
const Dish = require("../models/dish");

// Renderiza o formulário para criar um novo menu
exports.renderNewMenuForm = (req, res) => {
  res.render("menu/newMenu");
};


exports.createMenu = async (req, res) => {
  console.log("Arquivo recebido:", req.file); // Verifica o arquivo recebido
  console.log("Dados do formulário:", req.body); // Verifica os dados do formulário

  const { name } = req.body;
  const image = `/uploads/${req.file.filename}`;

  try {
    await Menu.create({ name, image });
    console.log("Menu salvo com sucesso:", { name, image });
    res.redirect("/menus");
  } catch (error) {
    console.error("Erro ao salvar o menu:", error);
    res.status(500).send("Erro ao salvar o menu.");
  }
};

// Exibe todos os menus
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find(); // Busca os menus no banco de dados
    res.render("menu/menus", { menus, user: { firstName: "John", lastName: "Doe" } });
  } catch (error) {
    console.error("Erro ao buscar os menus:", error);
    res.status(500).send("Erro ao buscar os menus.");
  }
};

// Exibe os pratos de um menu específico
exports.getMenuDishes = async (req, res) => {
  const { menuId } = req.query;

  try {
    const menu = await Menu.findById(menuId);
    const dishes = await Dish.find({ menu: menuId });
    res.render("menu/dishes", { pratos: dishes, menu, user: { firstName: "John", lastName: "Doe" } });
  } catch (error) {
    console.error("Erro ao buscar os pratos:", error);
    res.status(500).send("Erro ao buscar os pratos.");
  }
};

// Renderiza o formulário de edição de um menu
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

    const menu = await Menu.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!menu) {
      return res.status(404).send("Menu não encontrado.");
    }

    res.redirect("/menus");
  } catch (error) {
    console.error("Erro ao atualizar o menu:", error);
    res.status(500).send("Erro ao atualizar o menu.");
  }
};
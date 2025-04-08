const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Menu = require("../models/menu");
const Dish = require("../models/dish");


const menus = []; // Lista temporária para armazenar os menus

// Rota para exibir o formulário de criação de um novo menu
router.get("/new", (req, res) => {
  res.render("newMenu"); // Renderiza a página newMenu.ejs
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  console.log("Arquivo recebido:", req.file); // Verifica o arquivo recebido
  console.log("Dados do formulário:", req.body); // Verifica os dados do formulário

  const { name } = req.body;

  // Caminho relativo correto para o navegador
  const image = `/uploads/${req.file.filename}`;

  try {
    await Menu.create({ name, image });
    console.log("Menu salvo com sucesso:", { name, image });
    res.redirect("/menus");
  } catch (error) {
    console.error("Erro ao salvar o menu:", error);
    res.status(500).send("Erro ao salvar o menu.");
  }
});

// Rota para exibir os menus
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find(); // Busca os menus no banco de dados
    res.render("menus", { menus });
  } catch (error) {
    console.error("Erro ao buscar os menus:", error);
    res.status(500).send("Erro ao buscar os menus.");
  }
});

// Rota para exibir os pratos de um menu

router.get("/dishes", async (req, res) => {
  const { menuId } = req.query;

  try {
    const menu = await Menu.findById(menuId); // Busca o menu pelo ID
    const dishes = await Dish.find({ menu: menuId }); // Busca os pratos relacionados ao menu
    res.render("dishes", { pratos: dishes, menu }); // Passa o menu e os pratos para a view
  } catch (error) {
    console.error("Erro ao buscar os pratos:", error);
    res.status(500).send("Erro ao buscar os pratos.");
  }
});
module.exports = router;

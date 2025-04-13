const Dish = require("../models/dish");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

var dishController = {};

dishController.list = async function (req, res) {
  const { menuId } = req.query;

  try {
    const menu = await Menu.findById(menuId);

    const dishes = await Dish.find({ menu: menuId });

    res.render("menu/dishes", { pratos: dishes, menu });
  } catch (err) {
    console.log("Error listing dishes:", err);
    res.status(500).send("Error listing dishes.");
  }
};

dishController.addForm = function (req, res) {
  const menuId = req.query.menuId;
  res.render("menu/add", { menuId });
};

dishController.save = async function (req, res) {
  const { id } = req.params;

  try {
    let dish;
    if (id) {
      dish = await Dish.findById(id);
      if (!dish) {
        return res.status(404).send("Dish not found.");
      }

      dish.nome = req.body.dishName;
      dish.descricao = req.body.description;
      dish.categoria = req.body.category;
      dish.tempoPreparo = req.body.prepTime;
      dish.preco = req.body.price;
      dish.tamanhoPorcao = req.body.portionSize;
      dish.informacaoNutricional = {
        calorias: req.body.calories || 0,
        proteinas: req.body.protein || 0,
        carboidratos: req.body.carbs || 0,
        gorduras: req.body.fat || 0,
        sodio: req.body.sodium || 0,
      };

      if (req.file) {
        dish.imagem = `/uploads/${req.file.filename}`;
      }

      await dish.save();
    } else {
      dish = new Dish({
        nome: req.body.dishName,
        descricao: req.body.description,
        categoria: req.body.category,
        tempoPreparo: req.body.prepTime,
        preco: req.body.price,
        tamanhoPorcao: req.body.portionSize,
        informacaoNutricional: {
          calorias: req.body.calories || 0,
          proteinas: req.body.protein || 0,
          carboidratos: req.body.carbs || 0,
          gorduras: req.body.fat || 0,
          sodio: req.body.sodium || 0,
        },
        imagem: req.file ? `/uploads/${req.file.filename}` : null,
        menu: req.body.menuId,
      });

      await dish.save();
    }

    res.redirect(`/menus/dishes?menuId=${dish.menu}`);
  } catch (err) {
    console.log("Error saving dish:", err);
    res.status(500).send("Error saving dish.");
  }
};

dishController.editForm = async function (req, res) {
  const { id } = req.params;

  try {
    const dish = await Dish.findById(id);
    if (!dish) {
      return res.status(404).send("Dish not found.");
    }
    res.render("menu/add", { dish, menuId: dish.menu });
  } catch (err) {
    console.log("Error fetching dish for editing:", err);
    res.status(500).send("Error fetching dish.");
  }
};

dishController.update = async function (req, res) {
  const { id } = req.params;

  try {
    const dish = await Dish.findById(id);
    if (!dish) {
      return res.status(404).send("Dish not found.");
    }

    dish.nome = req.body.dishName;
    dish.descricao = req.body.description;
    dish.categoria = req.body.category;
    dish.tempoPreparo = req.body.prepTime;
    dish.preco = req.body.price;
    dish.tamanhoPorcao = req.body.portionSize;
    dish.informacaoNutricional = {
      calorias: req.body.calories || 0,
      proteinas: req.body.protein || 0,
      carboidratos: req.body.carbs || 0,
      gorduras: req.body.fat || 0,
      sodio: req.body.sodium || 0,
    };

    if (req.file) {
      dish.imagem = `/uploads/${req.file.filename}`;
    }

    await dish.save();
    res.redirect(`/menus/dishes?menuId=${dish.menu}`);
  } catch (err) {
    console.log("Error updating dish:", err);
    res.status(500).send("Error updating dish.");
  }
};

dishController.addForm = function (req, res) {
  const menuId = req.query.menuId;
  res.render("menu/add", { menuId, dish: null });
};

module.exports = { ...dishController, upload };

const Dish = require("../models/dish");
const Category = require("../models/category");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
  res.render("menu/add", { menuId, dish: null });
};

dishController.save = async function (req, res) {
  const { id } = req.params;

  try {
      let category;
      if (req.body.category === "new") {
          category = await Category.findOneAndUpdate(
              { name: req.body.newCategory },
              { name: req.body.newCategory },
              { upsert: true, new: true }
          );
      } else {
          category = await Category.findOne({ name: req.body.category });
      }

      let dish;
      if (id) {
          dish = await Dish.findById(id);
          if (!dish) {
              return res.status(404).send("Dish not found.");
          }

          dish.nome = req.body.dishName;
          dish.descricao = req.body.description;
          dish.categoria = category.name;
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
              categoria: category.name,
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
  try {
      const { id } = req.params;
      const dish = await Dish.findById(id);
      if (!dish) {
          return res.status(404).send("Dish not found.");
      }
      const categories = await Category.find();
      res.render("menu/add", { dish, menuId: dish.menu, categories });
  } catch (err) {
      console.error("Error fetching dish for editing:", err);
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

dishController.deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { menuId } = req.query;

    const dish = await Dish.findById(id);
    
    if (!dish) {
      return res.status(404).send("Prato não encontrado.");
    }
    
    if (dish.imagem) {
      const imagePath = path.join(
        __dirname, 
        "..", 
        "public",
        dish.imagem
      );
      
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Erro ao deletar imagem:", err);
        } else {
          console.log("Imagem deletada com sucesso:", imagePath);
        }
      });
    }

    await Dish.findByIdAndDelete(id);
    
    console.log("Prato deletado com sucesso:", id);
    res.redirect(`/menus/dishes?menuId=${menuId}`);
  } catch (error) {
    console.error("Erro ao deletar o prato:", error);
    res.status(500).send("Erro ao deletar o prato.");
  }
};

dishController.getDishDetails = async (req, res) => {
  try {
    const prato = await Dish.findById(req.params.id);
    if (!prato) {
      return res.status(404).send("Prato não encontrado");
    }

    if (!req.user) {
      return res.render("menu/dishInfo", { prato: prato, user: {} });
    }

    res.render("menu/dishInfo", { prato: prato, user: req.user });
  } catch (error) {
    console.error("Erro ao buscar detalhes do prato:", error);
    res.status(500).send("Erro ao buscar detalhes do prato");
  }
};

module.exports = { ...dishController, upload };

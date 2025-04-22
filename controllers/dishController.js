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

dishController.addForm = async function (req, res) {
  try {
    const menuId = req.cookies.menuId || req.query.menuId;
    
    const categories = await Category.find();
    res.render("menu/add", {
      menuId,
      dish: null,
      categories,
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Error fetching categories.");
  }
};

dishController.save = async function (req, res) {
  try {
    const menuId = req.body.menuId;

    const dishCount = await Dish.countDocuments({ menu: menuId });
    if (dishCount >= 10) {
      const categories = await Category.find(); 
      return res.status(400).render("menu/add", {
        menuId: menuId,
        dish: req.body,
        categories: categories,
        error: "This menu already has the maximum of 10 dishes."
      });
    }

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

    const dish = new Dish({
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
      menu: menuId,
    });

    await dish.save();
    res.redirect(`/menus/dishes?menuId=${menuId}`);
  } catch (err) {
    console.error("Error saving dish:", err);
    const categories = await Category.find(); 
    res.status(500).render("menu/add", {
      menuId: req.body.menuId,
      dish: req.body, 
      categories: categories, 
      error: "Error saving dish."
    });
  }
};

dishController.editForm = async function (req, res) {
  try {
    const dishId = req.cookies.dishId || req.query.dishId;
    
    if (req.query.dishId) {
      res.cookie("dishId", req.query.dishId, { httpOnly: true, secure: false });
      return res.redirect("/dishes/edit");
    }

    if (!dishId) {
      return res.status(400).send("Dish ID is required.");
    }

    const dish = await Dish.findById(dishId);
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
  try {
    const dishId = req.cookies.dishId || req.query.dishId;

    if (!dishId) {
      return res.status(400).send("Dish ID is required.");
    }

    const dish = await Dish.findById(dishId);
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

dishController.deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { menuId } = req.query;

    const dish = await Dish.findById(id);

    if (!dish) {
      return res.status(404).send("Prato não encontrado.");
    }

    if (dish.imagem) {
      const imagePath = path.join(__dirname, "..", "public", dish.imagem);

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
  const dishId = req.query.dishId || req.cookies.dishId; 

  if (req.query.dishId) {
      res.cookie("dishId", req.query.dishId, { httpOnly: true, secure: false });
      return res.redirect("/dishes/dish");
  }

  if (!dishId) {
      return res.status(400).send("Dish ID is required.");
  }

  try {
      const dish = await Dish.findById(dishId); 
      if (!dish) {
          return res.status(404).send("Dish not found.");
      } 
      res.render("menu/dishInfo", { prato: dish, user: req.user });
  } catch (error) {
      console.error("Error rendering dish details:", error);
      res.status(500).send("Error rendering dish details.");
  }
};

module.exports = { ...dishController, upload };

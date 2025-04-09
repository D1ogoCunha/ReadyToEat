var Dish = require("../models/dish");
var multer = require("multer");
var path = require("path");

// Configuração do multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads"); // Pasta onde as imagens serão salvas
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome único para cada arquivo
    },
});

var upload = multer({ storage: storage });

var dishController = {};

// Método para listar os pratos
dishController.list = async function (req, res) {
    const { menuId } = req.query; // Captura o menuId da query string

    try {
        // Busca o menu pelo ID
        const menu = await Menu.findById(menuId);

        // Busca os pratos relacionados ao menu
        const dishes = await Dish.find({ menu: menuId });

        // Renderiza a página dishes.ejs com os pratos e o menu
        res.render("menu/dishes", { pratos: dishes, menu });
    } catch (err) {
        console.log("Error listing dishes:", err);
        res.status(500).send("Error listing dishes.");
    }
};

// Método para exibir o formulário de adicionar prato
dishController.addForm = function (req, res) {
    const menuId = req.query.menuId; 
    res.render("menu/add", { menuId });
};

// Método para salvar um prato
dishController.save = async function (req, res) {
    try {
        console.log("Menu ID recebido:", req.body.menuId); // Adicione este log
        const dish = new Dish({
            nome: req.body.dishName, // Nome do prato
            descricao: req.body.description, // Descrição do prato
            categoria: req.body.category, // Categoria do prato
            tempoPreparo: req.body.prepTime, // Tempo de preparo
            preco: req.body.price, // Preço do prato
            tamanhoPorcao: req.body.portionSize, // Tamanho da porção
            informacaoNutricional: {
                calorias: req.body.calories || 0,
                proteinas: req.body.protein || 0,
                carboidratos: req.body.carbs || 0,
                gorduras: req.body.fat || 0,
                sodio: req.body.sodium || 0,
            },
            imagem: req.file ? `/uploads/${req.file.filename}` : null, // Caminho da imagem
            menu: req.body.menuId, // ID do menu relacionado
        });

        await dish.save();
        console.log("Dish saved successfully:", dish);
        res.redirect(`/menus/dishes?menuId=${req.body.menuId}`);
    } catch (err) {
        console.log("Error saving dish:", err);
        res.status(500).send("Error saving dish.");
    }
};

module.exports = { ...dishController, upload };
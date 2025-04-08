var mongoose = require("mongoose");

var DishSchema = new mongoose.Schema({
    nome: { type: String, required: true }, // Nome do prato
    descricao: { type: String, required: true }, // Descrição do prato
    categoria: { type: String, required: true }, // Categoria (Starter, Main, Dessert)
    tempoPreparo: { type: Number, required: true }, // Tempo de preparo em minutos
    preco: { type: Number, required: true }, // Preço do prato
    tamanhoPorcao: { type: String, required: true }, // Tamanho da porção (Small, Medium, Large)
    informacaoNutricional: {
        calorias: { type: Number, required: true }, // Calorias por 100g
        proteinas: { type: Number, required: true }, // Proteínas por 100g
        carboidratos: { type: Number, required: true }, // Carboidratos por 100g
        gorduras: { type: Number, required: true }, // Gorduras por 100g
        sodio: { type: Number, required: true }, // Sódio por 100g
    },
    imagem: { type: String, required: true }, // Caminho da imagem do prato
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true }, // Referência ao menu
    criadoEm: { type: Date, default: Date.now }, // Data de criação do prato
});

module.exports = mongoose.model("Dish", DishSchema);
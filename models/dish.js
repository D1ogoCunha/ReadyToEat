var mongoose = require("mongoose");

var DishSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    categoria: { type: String, required: true },
    tempoPreparo: { type: Number, required: true },
    preco: { type: Number, required: true },
    tamanhoPorcao: { type: String, required: true },
    informacaoNutricional: {
        calorias: { type: Number, required: true },
        proteinas: { type: Number, required: true },
        carboidratos: { type: Number, required: true }, 
        gorduras: { type: Number, required: true }, 
        sodio: { type: Number, required: true }, 
    },
    imagem: { type: String, required: true }, 
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true }, 
    criadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dish", DishSchema);
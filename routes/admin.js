var express = require("express");
var router = express.Router();
var User = require("../models/user"); 

router.get("/admin", async function (req, res, next) {
  try {
    // Procura todos os restaurantes
    const restaurants = await User.find({ role: "restaurant" });
    res.render("adminDashboard", { restaurants }); // Passa os restaurantes para a view
  } catch (err) {
    console.error("Erro ao buscar restaurantes:", err);
    res.status(500).send("Erro ao carregar a página.");
  }
});

router.delete("/restaurants/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("Restaurant deleted successfully.");
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    res.status(500).send("Failed to delete restaurant.");
  }
});

module.exports = router;
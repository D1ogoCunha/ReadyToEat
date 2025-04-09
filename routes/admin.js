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

router.get("/restaurants/:id/edit", async (req, res) => {
  try {
    const restaurant = await User.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found.");
    }
    res.render("editRestaurant", { restaurant });
  } catch (err) {
    console.error("Error fetching restaurant:", err);
    res.status(500).send("Failed to load edit form.");
  }
});

router.post("/restaurants/:id/edit", async (req, res) => {
  try {
    const { restaurantName, address, phone, pricePerPerson } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      restaurantName,
      address,
      phone,
      pricePerPerson,
    });
    res.redirect("/admin");
  } catch (err) {
    console.error("Error updating restaurant:", err);
    res.status(500).send("Failed to update restaurant.");
  }
});

module.exports = router;
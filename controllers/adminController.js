const User = require("../models/user");
const adminController = {};

adminController. getAdminDashboard = async (req, res) => {
  try {
    const restaurants = await User.find({ role: "restaurant" });
    res.render("admin/adminDashboard", { restaurants }); 
  } catch (err) {
    console.error("Error searching for restaurants:", err);
    res.status(500).send("Error loading page.");
  }
};

adminController.getRestaurantManagement = async (req, res) => {
  try {
    const restaurants = await User.find({ role: "restaurant" });
    res.render("admin/adminRestaurantManagement", { restaurants });
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).send("Error loading restaurant management page.");
  }
};


adminController.getPendingRestaurants = async (req, res) => {
  try {
    const pendingRestaurants = await User.find({ role: "restaurant", status: "in validation" });
    res.render("admin/pendingRequests", { pendingRestaurants });
  } catch (err) {
    console.error("All restaurants are valid:", err);
    res.status(500).send("Error loading page.");
  }
};

adminController.validateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    await User.findByIdAndUpdate(restaurantId, { status: "valid" });
    res.redirect("/admin/pending");
  } catch (err) {
    console.error("Error validating restaurant:", err);
    res.status(500).send("Failed to validate restaurant.");
  }
};

adminController.deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    console.log("Deleting restaurant with ID:", restaurantId);
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("Restaurant deleted successfully.");
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    res.status(500).send("Failed to delete restaurant.");
  }
};

adminController.getEditRestaurant = async (req, res) => {
  try {
    const restaurant = await User.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found.");
    }
    res.render("admin/editRestaurant", { restaurant });
  } catch (err) {
    console.error("Error fetching restaurant:", err);
    res.status(500).send("Failed to load edit form.");
  }
};

adminController.postEditRestaurant = async (req, res) => {
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
};

adminController.getAddNewRestaurant = (req, res) => {
  res.render("admin/addNewRestaurant");
};

adminController.postAddNewRestaurant = async (req, res) => {
  try {
    const { firstName, lastName, email, password, restaurantName, address, phone, pricePerPerson } = req.body;

    const newRestaurant = new User({
      firstName,
      lastName,
      email,
      password,
      role: "restaurant",
      restaurantName,
      address,
      phone,
      pricePerPerson,
    });

    await newRestaurant.save();
    res.redirect("/admin"); 
  } catch (err) {
    console.error("Error creating new restaurant:", err);
    res.status(500).send("Failed to create new restaurant.");
  }
};

module.exports = adminController;

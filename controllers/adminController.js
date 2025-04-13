const User = require("../models/user");

exports.getAdminDashboard = async (req, res) => {
  try {
    const restaurants = await User.find({ role: "restaurant" });
    res.render("admin/adminDashboard", { restaurants }); 
  } catch (err) {
    console.error("Error searching for restaurants:", err);
    res.status(500).send("Error loading page.");
  }
};

exports.getPendingRestaurants = async (req, res) => {
  try {
    const pendingRestaurants = await User.find({ role: "restaurant", status: "in validation" });
    res.render("admin/pendingRequests", { pendingRestaurants });
  } catch (err) {
    console.error("All restaurants are valid:", err);
    res.status(500).send("Error loading page.");
  }
};

exports.validateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    await User.findByIdAndUpdate(restaurantId, { status: "valid" });
    res.redirect("/admin/pending");
  } catch (err) {
    console.error("Error validating restaurant:", err);
    res.status(500).send("Failed to validate restaurant.");
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("Restaurant deleted successfully.");
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    res.status(500).send("Failed to delete restaurant.");
  }
};

exports.getEditRestaurant = async (req, res) => {
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

exports.postEditRestaurant = async (req, res) => {
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

exports.getAddNewRestaurant = (req, res) => {
  res.render("admin/addNewRestaurant");
};

exports.postAddNewRestaurant = async (req, res) => {
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

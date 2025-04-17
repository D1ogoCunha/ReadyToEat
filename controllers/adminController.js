const User = require("../models/user");
const Order = require("../models/order");
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

    if (!restaurant || restaurant.role !== "restaurant") {
      return res.status(404).render("error", {
        message: "Restaurant not found.",
        error: { status: 404, stack: "" },
      });
    }

    res.render("admin/editRestaurant", { restaurant });
  } catch (err) {
    console.error("Error fetching restaurant for editing:", err);
    res.status(500).render("error", {
      message: "An error occurred while fetching the restaurant.",
      error: { status: 500, stack: err.stack },
    });
  }
};

adminController.postEditRestaurant = async (req, res) => {
  try {
    const { restaurantName, address, phone, pricePerPerson } = req.body;
    const restaurantId = req.params.id;

    await User.findByIdAndUpdate(restaurantId, {
      restaurantName,
      address,
      phone,
      pricePerPerson,
    });

    res.redirect("/admin/restaurantManagement");
  } catch (err) {
    console.error("Error updating restaurant:", err);
    res.status(500).render("error", {
      message: "Failed to update restaurant.",
      error: { status: 500, stack: err.stack },
    });
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

adminController.getAnalytics = async (req, res) => {
  try {
    
    const topRestaurants = await User.aggregate([
      { $match: { role: "restaurant" } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "restaurantId",
          as: "orders",
        },
      },
      {
        $project: {
          name: "$restaurantName",
          orders: { $size: "$orders" },
        },
      },
      { $sort: { orders: -1 } },
      { $limit: 5 },
    ]);

    const revenueByRestaurant = await User.aggregate([
      { $match: { role: "restaurant" } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "restaurantId",
          as: "orders",
        },
      },
      {
        $project: {
          name: "$restaurantName",
          revenue: { $sum: "$orders.amount" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({ topRestaurants, revenueByRestaurant });
  } catch (err) {
    console.error("Error fetching analytics data:", err);
    res.status(500).send("Failed to load analytics data.");
  }
};

adminController.getAnalytics2 = async (req, res) => {
  try {
    const ordersByDate = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }, 
          },
          count: { $sum: 1 }, 
        },
      },
      { $sort: { _id: 1 } }, 
    ]);

    const labels = ordersByDate.map((order) => order._id); 
    const orders = ordersByDate.map((order) => order.count); 

    res.json({ labels, orders });
  } catch (err) {
    console.error("Error fetching analytics 2 data:", err);
    res.status(500).send("Failed to load analytics 2 data.");
  }
};

module.exports = adminController;

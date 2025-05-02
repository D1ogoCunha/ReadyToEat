const mongoose = require("mongoose");
const User = require("../models/user");
const Order = require("../models/order");
const Dish = require("../models/dish");
const bcrypt = require("bcrypt");

var userController = {};

userController.show = function (req, res) {
  User.findOne({ _id: req.params.id }).exec(function (err, user) {
    if (err) {
      console.log("Error retrieving user:", err);
    } else {
      res.render("../views/user/show", { user: user });
    }
  });
};


userController.edit = function (req, res) {
  User.findOne({ _id: req.params.id }).exec(function (err, user) {
    if (err) {
      console.log("Error retrieving user:", err);
    } else {
      res.render("../views/user/edit", { user: user });
    }
  });
};

userController.update = function (req, res) {
  User.findOne({ _id: req.params.id }).exec(function (err, user) {
    if (err) {
      console.log("Error retrieving user:", err);
    } else {
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;

      user.save(function (err) {
        if (err) {
          console.log("Error saving user:", err);
        } else {
          res.redirect("/users/" + user._id);
        }
      });
    }
  });
};

userController.delete = function (req, res) {
  User.findOneAndDelete({ _id: req.params.id }).exec(function (err, user) {
    if (err) {
      console.log("Error deleting user:", err);
    } else {
      res.redirect("/users");
    }
  });
};

userController.renderProfilePage = (req, res) => {
  res.render("user/profile", { user: req.user });
};

userController.renderSecurityProfilePage = (req, res) => {
  res.render("user/security", { user: req.user });
};


userController.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.render("user/security", {
        user: req.user,
        errorMessage: "New password and confirmation do not match.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.render("user/security", {
        user: req.user,
        errorMessage: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.render("user/security", {
        user: req.user,
        errorMessage: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.render("user/security", {
      user: req.user,
      successMessage: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.render("user/security", {
      user: req.user,
      errorMessage: "An error occurred while updating the password.",
    });
  }
};

userController.updateProfile = async (req, res) => {
    try {
      const { firstName, lastName, email, restaurantName, address, phone, pricePerPerson } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { firstName, lastName, email, restaurantName, address, phone, pricePerPerson },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        console.log("User not found for updating.");
        return res.status(404).send("User not found.");
      }
  
      console.log("User profile updated successfully.");
      res.redirect("/users/profile/edit"); 
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).send("Error updating profile.");
    }
  };

  userController.renderChartPage = (req, res) => {
    res.render("user/chart", { user: req.user});
  };
  
  userController.getMostOrderedDishes = async (req, res) => {
    try {
      const dishes = await Order.aggregate([
        { $unwind: "$dishes" }, 
        {
          $group: {
            _id: "$dishes",
            count: { $sum: 1 }, 
          },
        },
        { $sort: { count: -1 } }, 
        { $limit: 5 }, 
      ]);
  
      const dishDetails = await Dish.find({ _id: { $in: dishes.map((d) => d._id) } });
  
      const chartData = dishes
        .map((dish) => {
          const dishDetail = dishDetails.find((d) => d._id.equals(dish._id));
          if (dishDetail) {
            return {
              name: dishDetail.nome, 
              count: dish.count, 
            };
          }
          return null; 
        })
        .filter((dish) => dish !== null); 
  
      res.json(chartData); 
    } catch (error) {
      console.error("Error fetching most ordered dishes:", error);
      res.status(500).send("Failed to load chart data.");
    }
  };
  

module.exports = userController;

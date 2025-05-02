const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Cancelled"], default: "Pending" },
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
});

module.exports = mongoose.model("Order", orderSchema);
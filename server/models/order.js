const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Preparing', 'Completed', 'Cancelled'], 
  default: 'Pending' 
},
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true }],
  date: { type: Date, default: Date.now },
  paymentOption: { type: String, enum: ['restaurant', 'courier'], required: false },
  deliveryAddress: { type: String, required: false },
  reviews: [{
    comment: { type: String, required: false },
    image: { type: String, required: false },
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Order', OrderSchema);
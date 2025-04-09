var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['restaurant', 'customer', 'admin'], 
        required: true 
    },
    restaurantName: { type: String, required: function() { return this.role === 'restaurant'; } },
    address: { type: String, required: function() { return this.role === 'restaurant'; } },
    phone: { type: String, required: function() { return this.role === 'restaurant'; } },
    pricePerPerson: { type: Number, required: function() { return this.role === 'restaurant'; } },
});

module.exports = mongoose.model('User', UserSchema);
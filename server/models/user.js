var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    nif: { 
        type: Number,
        unique: true,
        required: true, 
        validate: {
            validator: function(value) {
                return /^\d{9}$/.test(value.toString());
            },
            message: 'Nif should have 9 digits.'
        }
    },
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
    image: { type: String, required: function() { return this.role === 'restaurant'; } },
    status: { 
        type: String, 
        enum: ['in validation', 'valid'], 
        default: function() { return this.role === 'restaurant' ? 'in validation' : 'valid'; }
    },
    deliveryDistance: { 
        type: Number, 
        required: function() { return this.role === 'restaurant'; },
        min: 1
    }
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  primaryDishTitle: { type: String, required: true },
  subDishTitle: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
    image: { type: String, required: true },
  cuisine: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], required: true }
});

module.exports = mongoose.model('Dish', DishSchema);

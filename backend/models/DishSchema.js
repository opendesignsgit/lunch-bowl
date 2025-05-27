const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  primaryDishTitle: { type: String, required: true },
  subDishTitle: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  cuisine: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], required: true },
  nutrition: {
    calories: {
      type: Number,
      default: 0,
      max: [5, "Calories must be 5 or less"],
    },
    fats: {
      type: Number,
      default: 0,
      max: [5, "fats must be 5 or less"],
    },
    carbs: {
      type: Number,
      default: 0,
      max: [5, "carbs must be 5 or less"],
    },
    vitamins: {
      type: Number,
      default: 0,
      max: [5, "vitamins must be 5 or less"],
    },
    proteins: {
      type: Number,
      default: 0,
      max: [5, "proteins must be 5 or less"],
    },
    minerals: {
      type: Number,
      default: 0,
      max: [5, "minerals must be 5 or less"],
    },
  },
});

module.exports = mongoose.model('Dish', DishSchema);

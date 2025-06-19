const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema(
  {
    primaryDishTitle: { type: String, required: true },
    subDishTitle: { type: String }, // Now optional
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // main image
    dishImage2: { type: String }, // second image, optional
    cuisine: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], required: true },
    ingredients: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0 && v[0].trim() !== ""; // At least one mandatory ingredient
        },
        message: "At least one ingredient is required",
      },
    },
    nutritionValues: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0 && v[0].trim() !== ""; // At least one mandatory nutrition value
        },
        message: "At least one nutrition value is required",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dish", DishSchema);
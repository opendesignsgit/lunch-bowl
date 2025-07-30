const mongoose = require('mongoose');

const deletedMealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  deletedMenus: [
    {
      childId: { type: mongoose.Schema.Types.ObjectId, required: true },
      date: { type: String, required: true }, // Use YYYY-MM-DD for easy comparison
      childName: { type: String }, // Optional: for display
    }
  ]
}, { timestamps: true });

const DeletedMeal = mongoose.model('DeletedMeal', deletedMealSchema);
module.exports = DeletedMeal;

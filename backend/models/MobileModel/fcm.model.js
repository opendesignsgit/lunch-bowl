const mongoose = require('mongoose');

const fcmTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    device: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FcmToken', fcmTokenSchema);

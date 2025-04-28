const mongoose = require("mongoose");

const phoneVerificationSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      // unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpSend: {
      type: Boolean,
      require: true,
    },
    signUp: {
      type: Boolean,
      require: true,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const PhoneVerification = mongoose.model(
  "PhoneVerification",
  phoneVerificationSchema
);

module.exports = PhoneVerification;

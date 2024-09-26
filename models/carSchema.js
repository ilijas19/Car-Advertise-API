const mongoose = require("mongoose");
const CarSchema = new mongoose.Schema(
  {
    model: {
      required: [true, "Please specify car model"],
      type: String,
      maxLength: 20,
    },
    make: {
      required: [true, "Please specify car make"],
      type: String,
      maxLength: 20,
    },
    price: {
      required: [true, "Please specify car price"],
      type: Number,
    },
    year: {
      required: [true, "Please specify car year"],
      type: Number,
    },
    description: {
      default: "No Additional Description",
      type: String,
      maxLength: 150,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", CarSchema);

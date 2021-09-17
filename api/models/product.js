const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  volume: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);

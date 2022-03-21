const mongoose = require("mongoose");

const ItemsSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  vatIn: { type: Number, required: true },
  vatOut: { type: Number, required: true },
});

module.exports = mongoose.model("Item", ItemsSchema);

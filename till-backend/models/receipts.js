const mongoose = require("mongoose");

const ReceiptsSchema = mongoose.Schema({
  ticket: { type: String, required: true },
  total: { type: Number, required: true },
  time: { type: Date, required: true },
  eatIn: { type: Boolean, required: true },
  payement: { type: String, required: true },
  user: { type: String },
});

module.exports = mongoose.model("Receipt", ReceiptsSchema);

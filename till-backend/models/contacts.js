const mongoose = require("mongoose");

const ContactsSchema = mongoose.Schema({
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

module.exports = mongoose.model("Contact", ContactsSchema);

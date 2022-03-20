const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, required: true },
});

module.exports = mongoose.model("User", UsersSchema);

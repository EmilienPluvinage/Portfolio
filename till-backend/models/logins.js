const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const LoginsSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

LoginsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Login", LoginsSchema);

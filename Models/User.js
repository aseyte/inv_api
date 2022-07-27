const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: String,
  firstname: String,
  lastname: String,
  verified: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("User", UserSchema, "user");
module.exports = User;

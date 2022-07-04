const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  password: String,
  firstname: String,
  middlename: String,
});

const User = mongoose.model("User", UserSchema, "user");
module.exports = User;

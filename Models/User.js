const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
    username: String,
    password: String,
    firstname: String,
    middlename: String,
    lastname: String,
}
)


const User = mongoose.model("User", UserSchema, "user");
module.exports = User;
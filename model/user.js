const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  surname: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    validate: {
      validator: (email) => email.includes("@"),
      message: "Incorrect email format",
    },
  },
  image: {
    type: String,
    lowercase: true,
    default: "http://example.com/avatar",
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;

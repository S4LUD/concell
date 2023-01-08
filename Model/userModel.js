const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  school_identification_number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  position: { type: String, required: true },
  image: { type: String },
});

userModel.set("timestamps", true);

module.exports = mongoose.model("user", userModel);

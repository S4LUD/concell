const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  school_identification_number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  position: { type: String, required: true },
});

userModel.set("timestamps", true);

module.exports = mongoose.model("user", userModel);

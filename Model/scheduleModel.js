const mongoose = require("mongoose");

const scheduleModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  ],
  From: { type: Date, required: true },
  To: { type: Date, required: true },
  Date: { type: Date, required: true },
});

scheduleModel.set("timestamps", true);

module.exports = mongoose.model("schedule", scheduleModel);

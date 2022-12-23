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
  scheduledAt: { type: Date, required: true },
});

scheduleModel.set("timestamps", true);

module.exports = mongoose.model("schedule", scheduleModel);

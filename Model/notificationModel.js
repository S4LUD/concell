const mongoose = require("mongoose");

const notificationModel = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  creator_id: { type: mongoose.Schema.Types.ObjectId, required: true },
});

notificationModel.set("timestamps", true);

module.exports = mongoose.model("notification", notificationModel);

const mongoose = require("mongoose");

const roomModel = new mongoose.Schema({
  room_name: {
    type: String,
    required: true,
  },
  room_details: {
    type: String,
    required: true,
  },
  creator_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  ],
  schedules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "schedule",
    },
  ],
  code: {
    type: String,
    required: true,
  },
});

roomModel.set("timestamps", true);

module.exports = mongoose.model("room", roomModel);

const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Adjust as needed
  status: { type: String, default: "free" },
});

module.exports = mongoose.model("Schedule", scheduleSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Appointment schema
const appointmentSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    appointmentType: {
      // Field for the type of appointment
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "canceled", "completed"],
      default: "pending", // Default to 'pending'
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
appointmentSchema.index({ status: 1 });

// Create the model
const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;

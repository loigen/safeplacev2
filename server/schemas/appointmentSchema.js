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
      enum: ["pending", "approved", "completed"],
      default: "pending", // Default to 'pending'
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receipt: {
      // Optional field for storing receipt URL
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model
const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;

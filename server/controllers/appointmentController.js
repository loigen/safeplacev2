const Appointment = require("../schemas/appointmentSchema");
const cloudinary = require("../config/cloudinary");
const { uploadReceipt } = require("../middlewares/multer");

//Create Appointment
exports.createAppointment = [
  uploadReceipt.single("receipt"),
  async (req, res) => {
    try {
      const {
        date,
        time,
        appointmentType,
        userId,
        firstname,
        lastname,
        email,
        role,
      } = req.body;

      if (
        !date ||
        !time ||
        !appointmentType ||
        !userId ||
        !firstname ||
        !lastname ||
        !email ||
        !role ||
        !req.file
      ) {
        return res
          .status(400)
          .json({ message: "All fields are required, including the receipt." });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "receipts",
        resource_type: "auto",
      });
      const receiptUrl = result.secure_url;

      const newAppointment = new Appointment({
        date,
        time,
        appointmentType,
        userId,
        firstname,
        lastname,
        email,
        role,
        receipt: receiptUrl,
      });

      await newAppointment.save();
      res.status(201).json(newAppointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ message: "Failed to create appointment." });
    }
  },
];
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("userId");
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "userId"
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Failed to fetch appointment." });
  }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
  try {
    const {
      date,
      time,
      appointmentType,
      status,
      firstname,
      lastname,
      email,
      role,
      receipt,
    } = req.body;

    if (
      !date &&
      !time &&
      !appointmentType &&
      !status &&
      !firstname &&
      !lastname &&
      !email &&
      !role &&
      !receipt
    ) {
      return res
        .status(400)
        .json({ message: "At least one field must be provided to update." });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        date,
        time,
        appointmentType,
        status,
        firstname,
        lastname,
        email,
        role,
        receipt,
      },
      { new: true }
    );

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(400).json({ message: "Failed to update appointment." });
  }
};

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Failed to delete appointment." });
  }
};

// Reject Appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "rejected";
    await appointment.save();

    res.status(200).json({ message: "Appointment rejected", appointment });
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Accept Appointment
exports.acceptAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "accepted";
    await appointment.save();

    res.status(200).json({ message: "Appointment accepted", appointment });
  } catch (error) {
    console.error("Error accepting appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch Pending Appointments
exports.getPendingAppointments = async (req, res) => {
  try {
    const pendingAppointments = await Appointment.find({
      status: "pending",
    }).populate("userId");
    res.status(200).json(pendingAppointments);
  } catch (error) {
    console.error("Error fetching pending appointments:", error);
    res.status(500).json({ message: "Failed to fetch pending appointments." });
  }
};
// Fetch Today's Appointments
exports.getTodaysAppointments = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

    // Find appointments for today with status "accepted"
    const todaysAppointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "accepted",
    }).populate("userId");

    res.status(200).json(todaysAppointments);
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({ message: "Failed to fetch today's appointments." });
  }
};
const getWeeklyAppointmentCounts = (appointments) => {
  const weekCounts = {};

  appointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const year = appointmentDate.getFullYear();
    const weekNumber = getWeekNumber(appointmentDate); // Function to get week number

    const weekKey = `${year}-W${weekNumber}`;
    weekCounts[weekKey] = (weekCounts[weekKey] || 0) + 1;
  });

  return weekCounts;
};

const getWeekNumber = (date) => {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + 1) / 7);
};

exports.getHighestWeeklyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      status: "accepted",
    }).populate("userId");
    const weeklyCounts = getWeeklyAppointmentCounts(appointments);

    // Find the week with the maximum count
    let maxCount = 0;
    let maxWeek = "";

    for (const [week, count] of Object.entries(weeklyCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxWeek = week;
      }
    }

    res.status(200).json({ week: maxWeek, count: maxCount });
  } catch (error) {
    console.error("Error fetching highest weekly appointments:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch highest weekly appointments." });
  }
};

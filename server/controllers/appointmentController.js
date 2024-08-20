const Appointment = require("../schemas/appointmentSchema");
const cloudinary = require("../config/cloudinary");
const { uploadReceipt } = require("../middlewares/multer");

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
        avatar,
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
        avatar,
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
exports.getTodaysAppointments = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

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

exports.getCancellationRate = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({
      status: { $in: ["accepted", "canceled"] },
    });

    const canceledAppointments = await Appointment.countDocuments({
      status: "canceled",
    });

    const cancellationRate =
      totalAppointments > 0
        ? (canceledAppointments / totalAppointments) * 100
        : 0;

    res.status(200).json({
      totalAppointments,
      canceledAppointments,
      cancellationRate: cancellationRate.toFixed(2) + "%",
    });
  } catch (error) {
    console.error("Error calculating cancellation rate:", error);
    res.status(500).json({ message: "Failed to calculate cancellation rate." });
  }
};

exports.getAppointmentData = async (req, res) => {
  try {
    const appointments = await Appointment.find().select(
      "date time appointmentType status firstname lastname avatar"
    );

    const appointmentData = appointments.map((appointment) => ({
      id: appointment._id,
      date: appointment.date.toLocaleDateString(),
      time: appointment.time,
      name: `${appointment.firstname} ${appointment.lastname}`,
      status: appointment.status,
      typeOfCounseling: appointment.appointmentType,
      avatar: appointment.avatar,
    }));

    res.status(200).json(appointmentData);
  } catch (error) {
    console.error("Error fetching appointment data:", error);
    res.status(500).json({ message: "Failed to fetch appointment data." });
  }
};
exports.getCurrentWeekAppointments = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    const weeklyAppointments = await Appointment.find({
      date: { $gte: startOfWeek, $lte: endOfWeek },
      status: "accepted",
    });

    const appointmentCount = weeklyAppointments.length;

    res.status(200).json({
      week: `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`,
      count: appointmentCount,
    });
  } catch (error) {
    console.error("Error fetching current week appointments:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch current week appointments." });
  }
};

exports.getDailyAppointmentsForCurrentWeek = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 6);

    const dailyAppointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek },
          status: "accepted",
        },
      },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
      {
        $group: {
          _id: "$day",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formattedResults = dailyAppointments.map((entry) => {
      const date = new Date(entry._id);
      return {
        day: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        count: entry.count,
      };
    });

    res.status(200).json({
      week: `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`,
      dailyAppointments: formattedResults,
    });
  } catch (error) {
    console.error("Error fetching daily appointments for current week:", error);
    res.status(500).json({
      message: "Failed to fetch daily appointments for current week.",
    });
  }
};

exports.getDailyCancelledAppointmentsForCurrentWeek = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 6);

    console.log("Start of Week:", startOfWeek.toISOString());
    console.log("End of Week:", endOfWeek.toISOString());

    const dailyAppointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek },
          status: "canceled",
        },
      },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
      {
        $group: {
          _id: "$day",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log("Daily cancelled Appointments:", dailyAppointments);

    if (dailyAppointments.length === 0) {
      res.status(200).json({
        week: `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`,
        dailyAppointments: [],
      });
      return;
    }

    const formattedResults = dailyAppointments.map((entry) => {
      return {
        day: new Date(entry._id).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        count: entry.count,
      };
    });

    res.status(200).json({
      week: `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`,
      dailyAppointments: formattedResults,
    });
  } catch (error) {
    console.error(
      "Error fetching daily canceled appointments for current week:",
      error
    );
    res.status(500).json({
      message: "Failed to fetch daily canceled appointments for current week.",
    });
  }
};
exports.getDailyAppointmentsForCurrentMonth = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const completedAppointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: "accepted",
        },
      },
      {
        $project: {
          day: { $dayOfMonth: "$date" },
        },
      },
      {
        $group: {
          _id: "$day",
          count: { $sum: 1 },
        },
      },
    ]);

    const canceledAppointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: "canceled",
        },
      },
      {
        $project: {
          day: { $dayOfMonth: "$date" },
        },
      },
      {
        $group: {
          _id: "$day",
          count: { $sum: 1 },
        },
      },
    ]);

    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const completedData = Array(daysInMonth).fill(0);
    const canceledData = Array(daysInMonth).fill(0);

    completedAppointments.forEach((entry) => {
      completedData[entry._id - 1] = entry.count;
    });

    canceledAppointments.forEach((entry) => {
      canceledData[entry._id - 1] = entry.count;
    });

    res.status(200).json({
      month: `${startOfMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`,
      datasets: {
        completed: completedData,
        canceled: canceledData,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching daily appointments for current month:",
      error
    );
    res.status(500).json({
      message: "Failed to fetch daily appointments for current month.",
    });
  }
};

exports.getYearlyAppointments = async (req, res) => {
  try {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    const completedAppointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startOfYear, $lte: endOfYear },
          status: "accepted",
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const canceledAppointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startOfYear, $lte: endOfYear },
          status: "canceled",
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const completedData = Array(12).fill(0);
    const canceledData = Array(12).fill(0);

    completedAppointments.forEach((entry) => {
      completedData[entry._id - 1] = entry.count;
    });

    canceledAppointments.forEach((entry) => {
      canceledData[entry._id - 1] = entry.count;
    });

    res.status(200).json({
      year: today.getFullYear(),
      datasets: {
        completed: completedData,
        canceled: canceledData,
      },
    });
  } catch (error) {
    console.error("Error fetching yearly appointments:", error);
    res.status(500).json({
      message: "Failed to fetch yearly appointments.",
    });
  }
};

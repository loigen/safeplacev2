const Schedule = require("../schemas/Schedule");

exports.getTodaysAppointments = async (req, res) => {
  try {
    const today = new Date();
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Schedule.find({
      date: { $gte: today, $lte: endOfDay },
      status: "accepted",
    }).sort({ time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addFreeTimeSlot = async (req, res) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }

    const freeSlot = new Schedule({
      date: new Date(date),
      time,
      status: "free",
    });

    await freeSlot.save();
    res.status(201).json(freeSlot);
  } catch (error) {
    console.error("Error adding free time slot:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFreeTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    await Schedule.findByIdAndDelete(id);
    res.status(200).json({ message: "Time slot deleted" });
  } catch (error) {
    console.error("Error deleting time slot:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Schedule.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    console.error("Error accepting appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Schedule.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

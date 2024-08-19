const Schedule = require("../schemas/Schedule");

// Fetch slots with status "Free"
exports.getFreeTimeSlots = async (req, res) => {
  try {
    const freeSlots = await Schedule.find({ status: "free" }).sort({
      date: 1,
      time: 1,
    });
    res.json(freeSlots);
  } catch (error) {
    console.error("Error fetching free time slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// add free slots
exports.addFreeTimeSlot = async (req, res) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }

    const existingSlot = await Schedule.findOne({
      date: new Date(date),
      time,
      status: "free",
    });

    if (existingSlot) {
      return res.status(400).json({ message: "Time slot already exists" });
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

// Delete the time slot
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

// Check if a time slot exists
exports.checkTimeSlot = async (req, res) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }

    const slotExists = await Schedule.findOne({
      date: new Date(date),
      time,
      status: "free",
    });

    res.json({ exists: !!slotExists });
  } catch (error) {
    console.error("Error checking time slot:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Update the Time Slot
exports.updateSlotStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Updating slot with ID: ${id} to status: ${status}`); // Add this line

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedSlot = await Schedule.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json(updatedSlot);
  } catch (error) {
    console.error("Error updating slot status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch pending Slots
exports.getPendingSlots = async (req, res) => {
  try {
    const pendingSlots = await Schedule.find({ status: "pending" }).sort({
      date: 1,
      time: 1,
    });
    res.json(pendingSlots);
  } catch (error) {
    console.error("Error fetching pending slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept a time slot
exports.acceptSlot = async (req, res) => {
  try {
    const { id } = req.params;

    // Log the ID for debugging purposes
    console.log(`Accepting slot with ID: ${id}`);

    // Update the slot's status to "accepted"
    const updatedSlot = await Schedule.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json(updatedSlot);
  } catch (error) {
    console.error("Error accepting slot:", error);
    res.status(500).json({ message: "Server error" });
  }
};

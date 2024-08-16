const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

router.post("/slots", scheduleController.addFreeTimeSlot);

router.get("/slots/check", scheduleController.checkTimeSlot);

router.get("/slots", scheduleController.getFreeTimeSlots);

router.delete("/slots/:id", scheduleController.deleteFreeTimeSlot);

router.patch("/slots/:id", scheduleController.updateSlotStatus);

router.get("/slots/pending", scheduleController.getPendingSlots); // Add this line

module.exports = router;

const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

router.get("/appointments/today", scheduleController.getTodaysAppointments);

router.post("/slots", scheduleController.addFreeTimeSlot);

router.delete("/slots/:id", scheduleController.deleteFreeTimeSlot);

router.put("/appointments/accept/:id", scheduleController.acceptAppointment);

router.put("/appointments/reject/:id", scheduleController.rejectAppointment);

module.exports = router;

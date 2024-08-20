const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController"); // Adjust the path as needed

// Create a new appointment
router.post("/appointments", appointmentController.createAppointment);

// Get all appointments
router.get("/appointments", appointmentController.getAppointments);

// Get appointment by ID
router.get("/appointments/:id", appointmentController.getAppointmentById);

// Update appointment
router.put("/appointments/:id", appointmentController.updateAppointment);

// Delete appointment
router.delete("/appointments/:id", appointmentController.deleteAppointment);

// Accept an appointment
router.patch("/accept/:id", appointmentController.acceptAppointment);

// Reject an appointment
router.patch("/reject/:id", appointmentController.rejectAppointment);

// Fetch pending appointments
router.get("/pending", appointmentController.getPendingAppointments);

router.get("/today", appointmentController.getTodaysAppointments);

router.get("/highest-weekly", appointmentController.getCurrentWeekAppointments);

router.get("/cancellation-rate", appointmentController.getCancellationRate);

router.get("/data", appointmentController.getAppointmentData);

router.get("/daily", appointmentController.getDailyAppointmentsForCurrentWeek);

router.get(
  "/dailyCancel",
  appointmentController.getDailyCancelledAppointmentsForCurrentWeek
);

router.get(
  "/dailyforMonth",
  appointmentController.getDailyAppointmentsForCurrentMonth
);

router.get(
  "/dailyCancelforMonth",
  appointmentController.getDailyCancelledAppointmentsForCurrentMonth
);
module.exports = router;

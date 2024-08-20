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

// Fetch today's appointments
router.get("/today", appointmentController.getTodaysAppointments);

// Fetch weekly's highest appointments
router.get("/highest-weekly", appointmentController.getCurrentWeekAppointments);

// Fetch entire rate of cancellation appointments
router.get("/cancellation-rate", appointmentController.getCancellationRate);

// Fetch patient's data appointments
router.get("/data", appointmentController.getAppointmentData);

// Fetch for the chart appointments
router.get("/daily", appointmentController.getDailyAppointmentsForCurrentWeek);

// Fetch for the chart appointments
router.get(
  "/dailyCancel",
  appointmentController.getDailyCancelledAppointmentsForCurrentWeek
);

// Fetch for the chart monthly appointments
router.get(
  "/dailyforMonth",
  appointmentController.getDailyAppointmentsForCurrentMonth
);

// Fetch for the chart yearly appointments
router.get("/yearly", appointmentController.getYearlyAppointments);

module.exports = router;

const express = require("express");
const feedbackController = require("../controllers/FeedbackController");

const router = express.Router();
router.post("/submit-feedback", feedbackController.submitFeedback);

module.exports = router;

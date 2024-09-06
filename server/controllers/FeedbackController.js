const Feedback = require("../schemas/feedbackSchema"); // Adjust the path as needed

// Controller function to handle feedback submission
exports.submitFeedback = async (req, res) => {
  const { rating, feedback, email, displayName } = req.body;

  // Validate input
  if (rating == null || feedback == null) {
    return res
      .status(400)
      .json({ message: "Rating and feedback are required." });
  }

  try {
    // Create a new feedback document
    const newFeedback = new Feedback({
      rating,
      feedback,
      email: email || "anonymous", // Use provided email or default to 'anonymous'
      displayName,
    });

    // Save feedback to the database
    const savedFeedback = await newFeedback.save();

    // Respond with success
    res.status(201).json({
      message: "Feedback submitted successfully!",
      feedback: savedFeedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Rating,
  Grid,
  Alert,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosConfig";

const FeedbackPage = ({ setView }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [displayName, setDisplayName] = useState(false);
  const [includeEmail, setIncludeEmail] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      rating,
      feedback,
      email: includeEmail ? user.email : "anonymous",
      displayName,
    };

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/Feedback/submit-feedback`,
        feedbackData
      );
      if (response.status === 201) {
        setSubmitted(true);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleGiveFeedbackClick = () => {
    setShowForm(true);
    setSubmitted(false);
    setRating(0);
    setFeedback("");
    setDisplayName(false);
    setIncludeEmail(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          padding: 4,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <IconButton onClick={() => setView("settings")}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" align="center" gutterBottom>
          We value your feedback
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          gutterBottom
        >
          Let us know how we can improve our services
        </Typography>

        {showForm ? (
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Rate your experience:
                </Typography>
                <Rating
                  name="site-rating"
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  precision={0.5}
                  size="large"
                  sx={{ marginBottom: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Email:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.email}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeEmail}
                      onChange={(e) => setIncludeEmail(e.target.checked)}
                    />
                  }
                  label="Include my email"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  sx={{ textTransform: "capitalize" }}
                  control={
                    <Checkbox
                      checked={displayName}
                      onChange={(e) => setDisplayName(e.target.checked)}
                    />
                  }
                  label={`Display as ${user.firstname} ${user.lastname}`}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Your Feedback"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{
                    backgroundColor: "#2c6975",
                    "&:hover": {
                      backgroundColor: "#4a8e8b",
                    },
                    paddingX: 4,
                  }}
                >
                  Submit Feedback
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Button
            variant="outlined"
            onClick={handleGiveFeedbackClick}
            sx={{
              display: "block",
              margin: "0 auto",
              marginTop: 2,
              color: "#2c6975",
              borderColor: "#2c6975",
              "&:hover": {
                borderColor: "#4a8e8b",
                color: "#4a8e8b",
              },
            }}
          >
            Give Feedback Again
          </Button>
        )}

        {submitted && (
          <Alert
            severity="success"
            sx={{
              marginTop: 2,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Thank you for your feedback!
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default FeedbackPage;

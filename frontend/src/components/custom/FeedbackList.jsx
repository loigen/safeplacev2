import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import axios from "axios";
import { Pie } from "react-chartjs-2";

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [ratingDistribution, setRatingDistribution] = useState({});

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/Feedback/feedback`
        );
        setFeedbackList(response.data.feedback);
        setLoading(false);

        const distribution = response.data.feedback.reduce((acc, feedback) => {
          acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
          return acc;
        }, {});
        setRatingDistribution(distribution);
      } catch (error) {
        setErrorMessage("Error retrieving feedback.");
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const ratingLabels = Object.keys(ratingDistribution).map(
    (key) => `${key} Star`
  );
  const ratingValues = Object.values(ratingDistribution);

  const data = {
    labels: ratingLabels,
    datasets: [
      {
        data: ratingValues,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ], // Colors for different ratings
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Feedback List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Card>
            <CardContent>
              <Typography variant="h6">Rating Distribution</Typography>
              <Pie data={data} />
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
          <List>
            {feedbackList.map((item) => (
              <ListItem key={item._id}>
                <ListItemText
                  primary={`Rating: ${item.rating}`}
                  secondary={
                    <>
                      <Typography variant="body2">{item.feedback}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.displayName
                          ? `— ${item.displayName}`
                          : "— Anonymous"}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
      >
        <Alert onClose={() => setErrorMessage("")} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FeedbackList;

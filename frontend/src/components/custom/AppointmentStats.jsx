import React, { useEffect, useState } from "react";
import { fetchPatients } from "../../api/appointmentAPI/fetchPatients";
import { LoadingSpinner } from "./index";
import {
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const AppointmentStats = () => {
  const [appointments, setAppointments] = useState({
    pending: [],
    accepted: [],
    completed: [],
    canceled: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("Week");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const data = await fetchPatients(dateRange);

        const categorizedAppointments = {
          pending: data.filter((app) => app.status === "pending"),
          accepted: data.filter((app) => app.status === "accepted"),
          completed: data.filter((app) => app.status === "completed"),
          canceled: data.filter((app) => app.status === "canceled"),
        };

        setAppointments(categorizedAppointments);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch appointment data");
        setLoading(false);
      }
    };

    getAppointments();
  }, [dateRange]);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );

  const renderAvatars = (appointments) => {
    return appointments.slice(0, 5).map((appointment, index) => (
      <Avatar
        key={index}
        src={appointment.avatar}
        alt="Profile"
        sx={{
          width: 40,
          height: 40,
          border: "2px solid #2c6975",
          margin: "2px",
        }}
      />
    ));
  };

  const renderStatusSection = (status) => {
    const count = appointments[status].length;
    return (
      <Grid item xs={12} md={6} lg={3} key={status}>
        <Card sx={{ backgroundColor: "#fff" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="#2c6975">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Typography>
            {count > 0 ? (
              <div>
                <div className="flex space-x-2 overflow-x-auto mb-2">
                  {renderAvatars(appointments[status])}
                </div>
                <Typography variant="body1" color="#2c6975">
                  <strong>{count}</strong> {status} Appointments
                </Typography>
              </div>
            ) : (
              <Typography color="textSecondary">No appointments</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <Typography
          variant="h5"
          gutterBottom
          className="w-full sm:w-auto"
          color="#2c6975"
        >
          Appointment Statistics
        </Typography>
        <FormControl
          className="w-1/4"
          margin="normal"
          fullWidth={isMobile}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#2c6975",
              },
              "&:hover fieldset": {
                borderColor: "#2c6975",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2c6975",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#2c6975",
            },
            "& .MuiSelect-icon": {
              color: "#2c6975",
            },
          }}
        >
          <InputLabel id="date-range-label">Date Range</InputLabel>
          <Select
            labelId="date-range-label"
            value={dateRange}
            onChange={handleDateRangeChange}
            label="Date Range"
          >
            <MenuItem value="Week">Week</MenuItem>
            <MenuItem value="Month">Month</MenuItem>
            <MenuItem value="Year">Year</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Grid container spacing={2}>
        {["pending", "accepted", "completed", "canceled"].map(
          renderStatusSection
        )}
      </Grid>
    </div>
  );
};

export default AppointmentStats;

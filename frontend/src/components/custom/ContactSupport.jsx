import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
} from "@mui/material";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import support from "../../images/support.gif";

const ContactSupport = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Contact Support
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#2c6975",
          padding: 2,
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={support}
            alt="Support"
            sx={{ width: 120, height: 120, backgroundColor: "#68b2a0" }}
          />
          <Box sx={{ color: "white" }}>
            <Typography variant="h6" gutterBottom>
              Support Team
            </Typography>
            <Typography
              variant="body2"
              sx={{
                backgroundColor: "#68b2a0",
                display: "inline-block",
                padding: "4px 8px",
                borderRadius: 1,
              }}
            >
              24/7 Support
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              We are here to assist you with any queries or issues.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            borderColor: "white",
            color: "white",
            "&:hover": { borderColor: "#68b2a0", color: "#68b2a0" },
          }}
        >
          FAQs
        </Button>
      </Box>

      <Typography variant="h5" align="center" gutterBottom>
        Contact Options
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                backgroundColor: "#2c6975",
                width: 60,
                height: 60,
                margin: "0 auto",
              }}
            >
              <MoveToInboxIcon sx={{ fontSize: "2.5rem", color: "white" }} />
            </Avatar>
            <Typography variant="body1" sx={{ mt: 2 }}>
              safeplacesupport@gmail.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email us for assistance
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                backgroundColor: "#2c6975",
                width: 60,
                height: 60,
                margin: "0 auto",
              }}
            >
              <LocalPhoneIcon sx={{ fontSize: "2.5rem", color: "white" }} />
            </Avatar>
            <Typography variant="body1" sx={{ mt: 2 }}>
              123-456-7890
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Call us for immediate assistance
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                backgroundColor: "#2c6975",
                width: 60,
                height: 60,
                margin: "0 auto",
              }}
            >
              <QuestionMarkIcon sx={{ fontSize: "2.5rem", color: "white" }} />
            </Avatar>
            <Typography variant="body1" sx={{ mt: 2 }}>
              help@safeplace.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email us for any queries
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactSupport;

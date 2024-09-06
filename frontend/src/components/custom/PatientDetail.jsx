import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Close as CloseIcon } from "@mui/icons-material";

const PatientDetails = ({ patient, onClose, handleRefund }) => {
  const [refundFile, setRefundFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setRefundFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRefundClick = () => {
    if (refundFile) {
      handleRefund(patient.id, refundFile);
      setRefundFile(null);
      setPreviewUrl(null);
    } else {
      alert("Please select a file before submitting.");
    }
  };

  const handleRemovePreview = () => {
    setRefundFile(null);
    setPreviewUrl(null);
  };

  return (
    <Modal
      open={!!patient}
      onClose={onClose}
      aria-labelledby="patient-details-modal"
      aria-describedby="patient-details-description"
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: "100%",
          maxWidth: 800,
          maxHeight: "90vh",
          mx: "auto",
          mt: 8,
          position: "relative",
          overflowY: "auto",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          align="center"
          color="text.secondary"
          className="capitalize"
          sx={{ mb: 2 }}
        >
          {patient.status}
        </Typography>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }} // Adjust layout based on screen size
          gap={2}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            {patient.qrCode && (
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  component="div"
                  sx={{ mb: 1 }}
                >
                  Patient's QR Code
                </Typography>
                <img
                  src={patient.qrCode}
                  alt="QR Code"
                  style={{
                    width: "100%",
                    maxWidth: 500, // Limit max width
                    height: "auto",
                    border: "1px solid #000",
                    borderRadius: 4,
                    padding: 4,
                  }}
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={patient.avatar || "https://via.placeholder.com/150"}
                  alt="Avatar"
                  style={{ width: 100, height: 100, borderRadius: "50%" }}
                />
              </Box>
              <Typography
                variant="h6"
                className="capitalize"
                sx={{ fontWeight: "bold" }}
              >
                {patient.name}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              component="div"
              align="center"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              About
            </Typography>
            <Box
              sx={{
                textAlign: "center",
                color: "text.secondary",
                mb: 4,
              }}
            >
              <Typography>{patient.time || "N/A"}</Typography>
              <Typography>{patient.date || "N/A"}</Typography>
              <Typography>{patient.email || "N/A"}</Typography>
              <Typography className="capitalize">
                {patient.typeOfCounseling || "N/A"}
              </Typography>
            </Box>

            {patient.status === "requested" && (
              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="refund-file"
                  style={{ display: "none" }}
                />
                <label htmlFor="refund-file" className="m-2">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{ mb: 2, color: "#2c6975", borderColor: "#2c6975" }}
                  >
                    Click to Upload Receipt
                  </Button>
                </label>

                {previewUrl && (
                  <Box sx={{ mb: 2, position: "relative" }}>
                    <img
                      src={previewUrl}
                      alt="Refund Preview"
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 4,
                      }}
                    />
                    <IconButton
                      onClick={handleRemovePreview}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "text.secondary",
                        backgroundColor: "background.paper",
                        borderRadius: "50%",
                        boxShadow: 2,
                        p: 0.5,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRefundClick}
                  disabled={!refundFile}
                  sx={{ mb: 2 }}
                >
                  Process Refund
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PatientDetails;

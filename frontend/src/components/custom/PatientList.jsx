import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Tooltip,
  Divider,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Swal from "sweetalert2";

const PatientList = ({ patients, itemsPerPage, onPatientSelect }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleMenuOpen = (event, patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const handleViewDetails = () => {
    onPatientSelect(selectedPatient);
    handleMenuClose();
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Type of Counseling
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Sex</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients
            .slice(
              currentPage * rowsPerPage,
              currentPage * rowsPerPage + rowsPerPage
            )
            .map((patient) => (
              <TableRow
                key={patient.id}
                hover
                sx={{ cursor: "pointer" }}
                className="capitalize"
              >
                <TableCell>{patient.date}</TableCell>
                <TableCell>{patient.time}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={
                      patient.status === "accepted"
                        ? "#4caf50" // Green
                        : patient.status === "refunded"
                        ? "#2196f3" // Blue
                        : patient.status === "rejected"
                        ? "#f44336" // Red
                        : patient.status === "pending"
                        ? "#ff9800" // Orange
                        : patient.status === "canceled"
                        ? "#b71c1c" // Dark Red
                        : patient.status === "requested"
                        ? "#00bcd4" // Cyan
                        : "#9e9e9e" // Gray
                    }
                  >
                    {patient.status}
                  </Typography>
                </TableCell>

                <TableCell>{patient.typeOfCounseling}</TableCell>
                <TableCell>{patient.sex}</TableCell>
                <TableCell align="right">
                  <Tooltip title="More options" arrow>
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, patient)}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        maxWidth: 200,
                        borderRadius: 2,
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <MenuItem onClick={handleViewDetails}>
                      View Details
                    </MenuItem>
                    {patient.status === "accepted" && (
                      <MenuItem
                        onClick={() => {
                          if (patient.meetLink) {
                            window.open(patient.meetLink, "_blank");
                          } else {
                            Swal.fire(
                              "Error",
                              "Meeting link is not available",
                              "error"
                            );
                          }
                        }}
                      >
                        Go to Room
                      </MenuItem>
                    )}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Divider />
      <TablePagination
        component="div"
        count={patients.length}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  );
};

export default PatientList;

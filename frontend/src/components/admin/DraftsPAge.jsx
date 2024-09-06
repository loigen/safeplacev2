import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Alert,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stack,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2c6975",
    },
    secondary: {
      main: "#4a8e8b",
    },
    text: {
      main: "#fff",
    },
    subheader: {
      main: "gray",
    },
  },
});

const DraftsPage = ({ searchQuery }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/blog/drafts`
        );
        setDrafts(response.data.drafts);
      } catch (error) {
        setError("Failed to fetch drafts");
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handleOpen = (draft) => {
    setSelectedDraft(draft);
    setFormValues({
      title: draft.title,
      content: draft.content,
      category: draft.category,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDraft(null);
  };

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/blog/${selectedDraft._id}/update`,
        formValues
      );
      setDrafts((prevDrafts) =>
        prevDrafts.map((draft) =>
          draft._id === selectedDraft._id ? { ...draft, ...formValues } : draft
        )
      );
      handleClose();
    } catch (error) {
      setError("Failed to update draft");
    }
  };

  const handlePublish = async (draftId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/blog/${draftId}/publish`
      );
      setDrafts((prevDrafts) =>
        prevDrafts.map((draft) =>
          draft._id === draftId ? { ...draft, status: "published" } : draft
        )
      );
    } catch (error) {
      setError("Failed to publish draft");
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        {error}
      </Alert>
    );

  const filteredDrafts = drafts.filter((draft) =>
    draft.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="primary.main"
        >
          Drafts
        </Typography>
        {filteredDrafts.length === 0 ? (
          <Typography variant="body1">No drafts found</Typography>
        ) : (
          <Grid container spacing={4}>
            {filteredDrafts.map((draft) => (
              <Grid item xs={12} sm={6} md={4} key={draft._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardHeader
                    title={draft.title}
                    subheader={
                      <Typography variant="body2" color="subheader">
                        {`Category: ${draft.category} | Author: ${draft.author}`}
                      </Typography>
                    }
                    action={
                      <IconButton
                        onClick={() => handleOpen(draft)}
                        color="text"
                      >
                        <EditIcon />
                      </IconButton>
                    }
                    sx={{
                      bgcolor: "primary.main",
                      color: "#fff",
                      textTransform: "capitalize",
                    }}
                  />
                  <Divider />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {draft.content.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, bgcolor: "background.paper" }}>
                    <Typography variant="caption" color="text.secondary">
                      Created on:{" "}
                      {new Date(draft.createdDate).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handlePublish(draft._id)}
                        disabled={draft.status === "published"}
                      >
                        Publish
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Draft</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              margin="normal"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={formValues.content}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formValues.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="Tech">Tech</MenuItem>
                <MenuItem value="Lifestyle">Lifestyle</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Save
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default DraftsPage;

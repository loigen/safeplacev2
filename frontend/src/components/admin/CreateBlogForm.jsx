import React, { useState } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const BlogModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    { id: "Technology", name: "Technology" },
    { id: "Health", name: "Health" },
    { id: "Lifestyle", name: "Lifestyle" },
    { id: "Education", name: "Education" },
  ];

  const handleSaveAsDraft = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/blog/save-draft`,
        {
          title,
          content,
          category,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Draft Saved!",
        text: response.data.message,
      });

      setTitle("");
      setContent("");
      setCategory("");
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response
          ? error.response.data.message
          : "Something went wrong!",
      });
      console.error(
        "Error saving draft:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/blog/create`,
        {
          title,
          content,
          category,
          publish: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Published!",
        text: response.data.message,
      });

      setTitle("");
      setContent("");
      setCategory("");
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response
          ? error.response.data.message
          : "Something went wrong!",
      });
      console.error(
        "Error publishing blog:",
        error.response ? error.response.data : error.message
      );
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <p className="text-black">Create Blog</p>
        <DialogActions>
          <Button
            onClick={handleSaveAsDraft}
            variant="outlined"
            color="primary"
          >
            Save as Draft
          </Button>
          <Button onClick={handlePublish} variant="contained" color="secondary">
            Publish
          </Button>
        </DialogActions>
        <IconButton
          edge="end"
          onClick={onClose}
          aria-label="close"
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <form>
          <FormControl
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray",
                },
                "&:hover fieldset": {
                  borderColor: "#2c6975",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2c6975",
                },
              },
            }}
            fullWidth
            margin="normal"
          >
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              required
              sx={{
                "& .MuiSelect-select": {
                  color: "gray",
                },
                "& .MuiSelect-select:hover": {
                  border: "black",
                },
              }}
              className="text-black"
            >
              <MenuItem sx={{ color: "gray" }} value="">
                <em className="text-black">Pick a category</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem sx={{ color: "black" }} key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray",
                },
                "&:hover fieldset": {
                  borderColor: "#2c6975",
                },
              },
            }}
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={6}
            margin="normal"
            required
            variant="outlined"
            placeholder="Write your content here..."
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray",
                },
                "&:hover fieldset": {
                  borderColor: "#2c6975",
                },
              },
            }}
          />
        </form>
      </DialogContent>
    </Dialog>,
    document.body
  );
};

export default BlogModal;

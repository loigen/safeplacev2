import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { LoadingSpinner, Navbar } from "./custom";

import {
  Divider,
  Button,
  TextField,
  IconButton,
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container,
  CardHeader,
} from "@mui/material";
const categories = [
  { id: "Technology", name: "Technology" },
  { id: "Health", name: "Health" },
  { id: "Lifestyle", name: "Lifestyle" },
  { id: "Education", name: "Education" },
];
const blogTheme = createTheme({
  palette: {
    primary: {
      main: "#2c6975",
    },
    secondary: {
      main: "#4a8e8b",
    },
    textColor: {
      main: "#fff",
    },
    subheader: {
      main: "gray",
    },
  },
});
const BlogGuestPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBlogs, setExpandedBlogs] = useState(new Set());
  const [fullBlogDetails, setFullBlogDetails] = useState(null);
  const [view, setView] = useState("all");

  useEffect(() => {
    const fetchUserProfileAndBlogs = async () => {
      setLoading(true);
      try {
        const blogsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/blog/allBlogs`
        );
        setBlogs(blogsResponse.data.blogs);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndBlogs();
  }, [view]);

  const handleToggleExpand = (blogId) => {
    setExpandedBlogs((prev) => {
      const newExpandedBlogs = new Set(prev);
      if (newExpandedBlogs.has(blogId)) {
        newExpandedBlogs.delete(blogId);
      } else {
        newExpandedBlogs.add(blogId);
      }
      return newExpandedBlogs;
    });
  };

  const filteredBlogs = blogs
    .filter((blog) => blog.category === selectedCategory)
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    .sort((a, b) => {
      if (view === "newest") {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return 0;
    });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const openFullContentView = (blog) => {
    setFullBlogDetails(blog);
  };

  const closeFullContentView = () => {
    setFullBlogDetails(null);
  };

  return (
    <ThemeProvider theme={blogTheme}>
      <Box sx={{ p: 3, bgcolor: "background.default" }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            color="subheader"
            fullWidth
            sx={{
              flex: 1,
              width: { xs: "100%", sm: "auto" },
              "& .MuiInputBase-input": {
                color: "gray",
              },
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

          <FormControl
            variant="outlined"
            size="small"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <InputLabel sx={{ color: "black" }}>View</InputLabel>
            <Select
              value={view}
              onChange={(e) => setView(e.target.value)}
              label="View"
              sx={{ color: "black" }}
            >
              <MenuItem sx={{ color: "black" }} value="all">
                All Blogs
              </MenuItem>

              <MenuItem sx={{ color: "black" }} value="newest">
                Newest
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Container>
          {filteredBlogs.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" color="text.secondary">
                {view === "favorites" ? (
                  <Box>
                    <Typography>
                      No favorites found, please add some favorites.
                    </Typography>
                  </Box>
                ) : (
                  <Typography>No blogs available for this category.</Typography>
                )}
              </Typography>
            </Grid>
          ) : (
            <Grid container spacing={4}>
              {filteredBlogs.map((blog) => (
                <Grid item xs={12} sm={6} md={4} key={blog._id}>
                  <Card>
                    <CardHeader
                      title={blog.title}
                      subheader={
                        <Typography variant="body2" color="subheader">
                          {`Category: ${blog.category} | Author: ${blog.author}`}
                        </Typography>
                      }
                      sx={{
                        bgcolor: "primary.main",
                        color: "#fff",
                        textTransform: "capitalize",
                      }}
                    />
                    <Divider />

                    <CardContent>
                      <Typography color="textSecondary">
                        {dayjs(blog.createdDate).format("MMM D, YYYY")}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {blog.content.length > 100 &&
                        !expandedBlogs.has(blog._id)
                          ? `${blog.content.substring(0, 100)}...`
                          : blog.content}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {blog.content.length > 100 && (
                        <IconButton
                          color="primary"
                          onClick={() => handleToggleExpand(blog._id)}
                          sx={{ fontSize: 15 }}
                        >
                          {expandedBlogs.has(blog._id)
                            ? "Show Less"
                            : "Read More"}
                        </IconButton>
                      )}
                      <Button
                        onClick={() => openFullContentView(blog)}
                        variant="outlined"
                        color="primary"
                      >
                        Read Full
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {fullBlogDetails && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: "10%",
              width: "90%",
              height: "100%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              display="flex"
              justifyContent="flex-end"
              sx={{ width: "100%", alignItems: "center" }}
            >
              <Button
                onClick={closeFullContentView}
                variant="contained"
                color="primary"
              >
                Close
              </Button>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              borderRadius={2}
              height="100%"
              padding={2}
              width="80%"
              alignItems="center"
            >
              <Typography
                variant="h6"
                fontSize={30}
                textTransform="capitalize"
                fontWeight="bold"
                gutterBottom
              >
                {fullBlogDetails.title}
              </Typography>
              <Typography
                fullWidth
                variant="body2"
                color="textSecondary"
                gutterBottom
              >
                {`Author: ${fullBlogDetails.author} | Published on: ${dayjs(
                  fullBlogDetails.createdDate
                ).format("MMM D, YYYY")}`}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  width: "100%",
                  overflowY: "auto",
                  maxHeight: "80vh",
                  bgcolor: "background.default",
                  p: 2,
                }}
              >
                <Typography variant="body1" fullWidth>
                  {fullBlogDetails.content}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default BlogGuestPage;

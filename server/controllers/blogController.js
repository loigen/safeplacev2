const Blog = require("../schemas/blogSchema");
const User = require("../schemas/User");
const mongoose = require("mongoose");

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: "Title, content, and category are required" });
    }

    const currentDate = new Date();
    const createdDate = currentDate.toISOString().split("T")[0];
    const createdTime = currentDate.toTimeString().split(" ")[0];

    const newBlog = new Blog({
      title,
      content,
      category,
      author: "Jeb Doe",
      createdDate,
      createdTime,
      status: "draft", // Default to draft if not published
    });

    const savedBlog = await newBlog.save();

    res
      .status(201)
      .json({ message: "Blog created successfully", blog: savedBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveBlogAsDraft = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: "Title, content, and category are required" });
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      author: "Jeb Doe",
      status: "draft",
    });

    const savedBlog = await newBlog.save();

    res
      .status(201)
      .json({ message: "Blog saved as draft successfully", blog: savedBlog });
  } catch (error) {
    console.error("Error saving blog as draft:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedDate: -1 });

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.addToFavorites = async (req, res) => {
  const { blogId, userId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(blogId)
  ) {
    return res.status(400).json({ message: "Invalid userId or blogId" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userObjectId = mongoose.Types.ObjectId(userId);

    if (!blog.readerIDs.includes(userObjectId)) {
      blog.readerIDs.push(userObjectId);
      await blog.save();
    }

    res.status(200).json({ message: "Added to favorites" });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeFromFavorites = async (req, res) => {
  const { blogId, userId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(blogId)
  ) {
    return res.status(400).json({ message: "Invalid userId or blogId" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userObjectId = mongoose.Types.ObjectId(userId);

    if (blog.readerIDs.includes(userObjectId)) {
      blog.readerIDs = blog.readerIDs.filter((id) => !id.equals(userObjectId));
      await blog.save();
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.favoriteBlogs.includes(blogId)) {
      user.favoriteBlogs = user.favoriteBlogs.filter(
        (id) => !id.equals(blogId)
      );
      await user.save();
    }

    res.status(200).json({ message: "Blog removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const blogs = await Blog.find({
      readerIDs: mongoose.Types.ObjectId(userId),
    }).sort({ publishedDate: -1 });

    if (!blogs.length) {
      return res.status(404).json({ message: "No favorite blogs found" });
    }

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching favorite blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getNewestBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(10);

    res.json({ blogs });
  } catch (error) {
    console.error("Error fetching newest blogs:", error);
    res.status(500).json({ message: "Failed to fetch newest blogs" });
  }
};

exports.getBlogsByReaderId = async (req, res) => {
  try {
    const { userID } = req.params;
    console.log(`Received request to fetch blogs for user ID: ${userID}`);

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      console.error("Invalid userId:", userID);
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Convert the userID to a mongoose ObjectId
    const objectId = mongoose.Types.ObjectId(userID);

    // Find blogs where the readerIDs array contains the ObjectId
    const blogs = await Blog.find({ readerIDs: objectId });

    if (blogs.length > 0) {
      return res.status(200).json(blogs);
    } else {
      console.log(`No blogs found for user ID: ${userID}`);
      return res.status(404).json({ message: "No blogs found for this user." });
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

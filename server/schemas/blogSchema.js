const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the Blog
const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    default: "Jeb Doe",
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdTime: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["draft", "published"],
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  readerIDs: [
    {
      type: String,
      ref: "User",
      required: false,
    },
  ],
});

// Create a model based on the schema
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;

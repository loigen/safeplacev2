import React, { useState } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import "tailwindcss/tailwind.css";
import axiosInstance from "../../config/axiosConfig";

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
      const response = await axiosInstance.post(
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
      const response = await axiosInstance.post(
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Create a New Blog</h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title:
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content:
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category:
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BlogModal;

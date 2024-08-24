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
    <div className="fixed inset-0  bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-2 rounded-lg shadow-lg w-full max-w-lg mx-4 relative">
        <div className="flex justify-end ">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            className="px-4 py-2  text-black font-medium rounded-md hover:text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="px-4 py-2  text-black font-medium rounded-sm shadow-sm hover:text-white hover:bg-[#2C6975] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            Publish
          </button>
          <button
            className="bg-[#c1e4dc] p-3 rounded-full text-green-800 hover:text-gray-600"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <div>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 block w-[40%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2C6975] focus:border-[#2C6975] sm:text-sm"
              >
                <option value="">Pick a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                placeholder="Title..."
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 font-bold placeholder:text-3xl text-9xl block w-full px-3 py-2 text-center rounded-md shadow-sm focus:outline-none sm:text-lg"
              />
            </div>
            <div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Write your content here..."
                className="mt-1 h-[20vh] resize-none block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BlogModal;

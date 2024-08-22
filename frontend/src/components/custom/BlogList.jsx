import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { fetchUserProfile } from "../api/userAPI/fetchUserProfile";
import LoadingSpinner from "./LoadingSpinner";

const categories = [
  { id: "Technology", name: "Technology" },
  { id: "Health", name: "Health" },
  { id: "Lifestyle", name: "Lifestyle" },
  { id: "Education", name: "Education" },
];

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteBlogs, setFavoriteBlogs] = useState([]);
  const [expandedBlogs, setExpandedBlogs] = useState(new Set());

  useEffect(() => {
    const fetchUserProfileAndBlogs = async () => {
      setLoading(true);
      try {
        const userProfile = await fetchUserProfile();
        setUserId(userProfile._id); // or the correct field for user ID

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/blog/allBlogs`
        );
        setBlogs(response.data.blogs);

        // Fetch favorites if view is set to favorites
        if (view === "favorites") {
          const favoritesResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/blog/userFavorites/${userProfile._id}`
          );
          setFavoriteBlogs(favoritesResponse.data.favorites);
        }
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

  const handleToggleFavorite = async (blogId) => {
    try {
      const isFavorite = favoriteBlogs.includes(blogId);
      const url = isFavorite
        ? `${process.env.REACT_APP_API_URL}/blog/removeFromFavorites/${blogId}/${userId}`
        : `${process.env.REACT_APP_API_URL}/blog/addToFavorites/${blogId}/${userId}`;

      const response = await axios.post(url);
      Swal.fire({
        icon: isFavorite ? "success" : "info",
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        text: response.data.message,
      });

      setFavoriteBlogs((prev) =>
        isFavorite ? prev.filter((id) => id !== blogId) : [...prev, blogId]
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update favorites",
      });
    }
  };

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
    .filter((blog) => {
      if (view === "favorites") {
        return favoriteBlogs.includes(blog._id);
      }
      return true;
    })
    .sort((a, b) => {
      if (view === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded-md mr-4 flex-1"
        />
        <label htmlFor="view" className="mr-2 font-semibold text-gray-700">
          View:
        </label>
        <select
          id="view"
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="all">All Blogs</option>
          <option value="favorites">Favorites</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="mb-4 w-full justify-between flex border-b border-gray-300">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 text-sm font-semibold ${
              selectedCategory === category.id
                ? "border-b-4 border-t-0 border-l-0 border-r-0  border-b-[#2C6975] text-black"
                : "border-none bg-transparent text-gray-800"
            } border border-gray-300 rounded-t-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-600">
          {view === "favorites"
            ? "No favorites found, please add some favorites."
            : "No blogs available for this category."}
        </p>
      ) : (
        filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="border border-gray-300 p-4 rounded-md shadow-sm mb-4"
          >
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="mb-4">
              {expandedBlogs.has(blog._id)
                ? blog.content
                : blog.content.length > 200
                ? blog.content.substring(0, 200) + "..."
                : blog.content}
              {blog.content.length > 200 && (
                <button
                  onClick={() => handleToggleExpand(blog._id)}
                  className="text-blue-600 hover:underline ml-2"
                >
                  {expandedBlogs.has(blog._id) ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">
                Likes: {blog.readerIDs ? blog.readerIDs.length : 0}
              </span>
              <button
                onClick={() => handleToggleFavorite(blog._id)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {favoriteBlogs.includes(blog._id) ? (
                  <FavoriteIcon className="text-red-600" />
                ) : (
                  <FavoriteBorderIcon className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AllBlogs;

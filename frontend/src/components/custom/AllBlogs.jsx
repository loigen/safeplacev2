import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axiosInstance from "../../config/axiosConfig";
import { fetchUserProfile } from "../../api/userAPI/fetchUserProfile";

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

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/blog/allBlogs`
        );
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch blogs. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const user = await fetchUserProfile();

        setUserId(user._id);

        const favoritesResponse = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/blog/userFavorites/${user._id}`
        );
        setFavoriteBlogs(favoritesResponse.data.blogs.map((blog) => blog._id));
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
      }
    };

    fetchBlogs();
    fetchUser();
  }, []);

  const handleToggleFavorite = async (blogId) => {
    try {
      const isFavorite = favoriteBlogs.includes(blogId);
      const url = isFavorite
        ? `${process.env.REACT_APP_API_URL}/blog/removeFromFavorites/${blogId}/${userId}`
        : `${process.env.REACT_APP_API_URL}/blog/addToFavorites/${blogId}/${userId}`;

      const response = await axiosInstance.post(url);
      Swal.fire({
        icon: isFavorite ? "success" : "success",
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

  const filteredBlogs = blogs.filter((blog) => {
    if (view === "favorites") {
      return (
        favoriteBlogs.includes(blog._id) &&
        blog.category === selectedCategory &&
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        blog.status === "published"
      );
    }

    if (view === "drafts") {
      return blog.status === "draft" && blog.category === selectedCategory;
    }

    return (
      blog.category === selectedCategory &&
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      blog.status === "published"
    );
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-5 py-2 rounded-full mr-10 flex-1 outline-none"
        />
        <label
          htmlFor="view"
          className="mr-2 text-sm font-semibold text-gray-700"
        >
          Sort By:
        </label>
        <select
          id="view"
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border border-gray-300 p-1 rounded-md"
        >
          <option value="all">All Blogs</option>
          <option value="favorites">Favorites</option>
          <option value="newest">Newest</option>
          <option value="drafts">Drafts</option>
        </select>
      </div>

      <div className="mb-4 flex border-b border-gray-300">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 text-sm font-semibold ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
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
            : view === "drafts"
            ? "No drafts available."
            : "No blogs available for this category."}
        </p>
      ) : (
        filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="border border-gray-300 p-4 rounded-md shadow-sm mb-4"
          >
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p>{blog.content}</p>
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

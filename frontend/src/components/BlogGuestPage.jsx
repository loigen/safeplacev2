import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { LoadingSpinner, Navbar } from "./custom";
const categories = [
  { id: "Technology", name: "Technology" },
  { id: "Health", name: "Health" },
  { id: "Lifestyle", name: "Lifestyle" },
  { id: "Education", name: "Education" },
];
const BlogGuestPage = () => {
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

  return (
    <div>
      <Navbar />
      <br />
      <div className="px-[10%] py-[5%]">
        <div className="mb-4 flex items-center gap-20">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-500 py-3 px-10 rounded-full mr-4 flex-1"
          />
          <div>
            <label htmlFor="view" className="mr-2 font-semibold text-gray-700">
              View:
            </label>
            <select
              id="view"
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="border border-gray-300 p-1 rounded-xl cursor-pointer outline-none"
            >
              <option value="all">All Blogs</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col w-full justify-center items-center mx-auto p-6 bg-transparent rounded-lg">
          <div className="mb-4 w-full justify-between flex border-b border-gray-300">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm font-semibold ${
                  selectedCategory === category.id
                    ? "border-b-4 border-t-0 border-l-0 border-r-0  border-b-[#2C6975] text-black"
                    : "border-none bg-transparent text-gray-800"
                } border rounded-t-md hover:border-b-[#2C6975] hover:border-b-4 hover:border-solid focus:outline-none `}
              >
                {category.name}
              </button>
            ))}
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center text-gray-600">
              {view === "favorites" ? (
                <>
                  <p>No favorites found, please add some favorites.</p>
                  <button onClick={() => setView("all")}>go to newsfeed</button>
                </>
              ) : (
                <p>No blogs available for this category.</p>
              )}
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="border w-[40vw] border-gray-300 p-4 rounded-md shadow-sm mb-4"
              >
                <div className="flex gap-2 items-center">
                  <h2>{blog.author}</h2>·
                  <h2 className="text-gray-700 text-sm">
                    {dayjs(blog.createdDate).format("YYYY-MM-DD")}
                  </h2>
                </div>
                <h3 className="text-2xl capitalize font-medium">
                  {blog.title}
                </h3>
                <p className="mb-4 text-sm w-full">
                  {expandedBlogs.has(blog._id)
                    ? blog.content
                    : blog.content.length > 200
                    ? blog.content.substring(0, 200) + "..."
                    : blog.content}
                  {blog.content.length > 200 && (
                    <button
                      onClick={() => handleToggleExpand(blog._id)}
                      className="text-blue-600 hover:underline "
                    >
                      {expandedBlogs.has(blog._id) ? "Read Less" : "Read More"}
                    </button>
                  )}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogGuestPage;

import React, { useEffect, useState } from "react";
import axios from "axios";

const DraftsPage = ({ searchQuery }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/blog/drafts");
        setDrafts(response.data.drafts);
      } catch (error) {
        setError("Failed to fetch drafts");
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  const filteredDrafts = drafts.filter((draft) =>
    draft.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Drafts</h1>
      {filteredDrafts.length === 0 ? (
        <p>No drafts found</p>
      ) : (
        <ul className="space-y-4">
          {filteredDrafts.map((draft) => (
            <li
              key={draft._id}
              className=" rounded-lg p-4 border border-gray-300 shadow-md"
            >
              <h2 className="text-xl font-semibold">{draft.title}</h2>
              <p className="text-gray-700">
                {draft.content.substring(0, 100)}...
              </p>
              <p className="text-gray-500">Category: {draft.category}</p>
              <p className="text-gray-500">Author: {draft.author}</p>
              <p className="text-gray-500">
                Created on: {new Date(draft.createdDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DraftsPage;

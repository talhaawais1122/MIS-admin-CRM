import React, { useState, useEffect } from 'react';
import axios from 'axios';



const CreateTag = () => {
  const [tags, setTags] = useState([]); // For storing fetched tags
  const [name, setName] = useState(''); // For creating a new tag
  const [error, setError] = useState(null); // For error messages
  const [message, setMessage] = useState(''); // For success messages
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // For controlling modal visibility

  const token =   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDc4NDgxZjY0ZWQzNmU4MzA0NmE3ZiIsInR5cGUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AbWVsZGluLmNvIiwiaWF0IjoxNzMzOTExNzk1LCJleHAiOjE3MzM5OTgxOTV9.FjwWFuMgVk3X_U2TJqasVikDQh8J3mfeizZKbU7PKSw";


  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/tags/get/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTags(response.data.tags); // Set the tags in the state
      } catch (error) {
        console.error('Error fetching tags:', error);
        setError('Failed to fetch tags');
      }
    };

    fetchTags();
  }, []);

  // Handle form submission for creating a new tag
  const handleSubmit = async (e) => {
 

    if (!name) {
      setError('Tag name is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/tags/new',
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // On success, show the message and clear the input
      setMessage(response.data.message);
      setError(null);
      setName('');
      setTags((prevTags) => [...prevTags, response.data.tag]); // Add the new tag to the list

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Something went wrong');
      } else {
        setError('Network or server error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tag deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/v1/tags/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`http://localhost:3000/api/v1/tags/delete/${id}`)

        setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
        setMessage(response.data.message); // Show success message
      } catch (error) {
        setError('Failed to delete tag');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <div className="w-full max-w-4xl p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-white">Tags</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
          >
            New Tag
          </button>
        </div>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Display the tags list */}
        <div className="space-y-4">
          {tags.length === 0 ? (
            <p className="text-center ">No tags available</p>
          ) : (
            tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between px-4 py-3 border rounded-lg shadow-sm hover:bg-gray-100">
                <div>
                  <span className="text-white font-semibold">{tag.name}</span>
                  <br />
                  <span className="text-white text-sm">ID: {tag.id}</span>
                </div>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for creating new tag */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create New Tag</h2>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Tag Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter tag name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-medium rounded-lg ${
                    isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Tag...' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTag;

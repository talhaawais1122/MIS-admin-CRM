import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetAllCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
 // Replace with your token
 const token =
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDc4NDgxZjY0ZWQzNmU4MzA0NmE3ZiIsInR5cGUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AbWVsZGluLmNvIiwiaWF0IjoxNzMzODQyNzQ4LCJleHAiOjE3MzM5MjkxNDh9.PWhyDUD4HaT2nqSA5SifraTCupxxBVOBIOyXJyq1H9g";

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/campaigns/get/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCampaigns(response.data.campaigns || []);
      } catch (error) {
        setError('Failed to fetch campaigns');
      }
    };

    fetchCampaigns();
  }, []);

  // Handle creating a new campaign
  const handleSubmit = async () => {

    setError(null);
    if (!campaignName) {
      setError('Campaign name is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/campaigns/new',
        { name: campaignName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setCampaigns((prev) => [...prev, response.data.campaign]);
      setCampaignName('');
      setIsModalOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a campaign
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/v1/campaigns/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(response.data.message);
        setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
      } catch (error) {
        setError('Failed to delete campaign');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <div className="w-full max-w-4xl p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-white">Campaigns</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
          >
            New Campaign
          </button>
        </div>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <p className="text-center text-white ">No campaigns available</p>
          ) : (
            campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between px-4 py-3  border border-white -600 rounded-lg shadow-sm hover:bg-orange-600"
              >
                <div>
                  <span className="text-gray-700 font-semibold">{campaign.name}</span>
                  <br />
                  <span className="text-gray-500 text-sm">ID: {campaign.id}</span>
                </div>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for creating a new campaign */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create New Campaign</h2>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="campaignName" className="block text-gray-700 font-medium mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
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
                  {isLoading ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllCampaigns;

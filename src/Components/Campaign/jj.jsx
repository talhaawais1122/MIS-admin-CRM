]import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../../ContextApi/UserContext";

const LeadDetails = () => {
  const { leadId } = useContext(UserContext);
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState({});
  const [activeTab, setActiveTab] = useState("details");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [extraInfo, setExtraInfo] = useState(null);
  const [interNotes, setInterNotes] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDc4NDgxZjY0ZWQzNmU4MzA0NmE3ZiIsInR5cGUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AbWVsZGluLmNvIiwiaWF0IjoxNzMzODQyNzQ4LCJleHAiOjE3MzM5MjkxNDh9.PWhyDUD4HaT2nqSA5SifraTCupxxBVOBIOyXJyq1H9g";

  useEffect(() => {
    if (!leadId) {
      setError("Lead ID is missing.");
      setLoading(false);
      return;
    }

    const fetchLeadDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/leads/details/${leadId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLead(res.data.data);
        setExtraInfo({
          companyName: res.data.data.companyName,
          jobPosition: res.data.data.jobPosition,
          companyMobileNumber: res.data.data.companyMobileNumber,
          address: res.data.data.address,
          zipCode: res.data.data.zipCode,
          website: res.data.data.website,
        });
        setInterNotes(res.data.data.interNotes || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch lead details");
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        const res = await axios.get(
          `http://localhost:3000/api/v1/leads/${leadId}/activities`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setActivities(res.data.activities || {});
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchLeadDetails();
    fetchActivities();
  }, [leadId]);

  const renderActivities = (activities) => {
    const dates = Object.keys(activities);

    if (dates.length === 0) {
      return <p className="text-white">No activities found</p>;
    }

    return (
      <ul className="space-y-4">
        {dates.map((date) => (
          <li key={date} className="mb-4">
            <h3 className="font-bold text-orange-600 mb-2">{date}</h3>
            <ul className="space-y-2">
              {activities[date].map((activity, index) => (
                <li
                  key={index}
                  className="border border-orange-600 rounded p-3 bg-black text-white"
                >
                  <p className="font-semibold">{activity.details}</p>
                  <p className="text-sm text-gray-400">Time: {activity.time}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen text-orange-600 flex">
      <main className="flex-1 p-6">
        <header className="shadow mb-6 p-4 rounded-lg flex items-center justify-between">
          <button
            className="font-semibold"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>
          <h1 className="font-bold mx-auto">
            {lead?.contactName || "Lead Details"}
          </h1>
        </header>

        <div className="shadow rounded-lg p-6">
          {loading ? (
            <div className="text-center">
              <div className="loader"></div>
              <p>Loading lead details...</p>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            lead && (
              <div>
                {/* Other tabs and content */}
              </div>
            )
          )}
        </div>
      </main>

      <aside className="w-1/4 mt-6 shadow p-4">
        <h2 className="font-bold text-lg mb-4 text-orange-600">Activity Log</h2>
        {loadingActivities ? (
          <p className="text-white">Loading activities...</p>
        ) : (
          renderActivities(activities)
        )}
      </aside>
    </div>
  );
};

export default LeadDetails;

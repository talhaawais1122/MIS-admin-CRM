import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../../ContextApi/UserContext";

const LeadDetails = () => {
  const { leadId } = useContext(UserContext);
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [extraInfo, setExtraInfo] = useState(null);
  const [extraInfoLoading, setExtraInfoLoading] = useState(true);
  const [extraInfoError, setExtraInfoError] = useState("");
  const [interNotes, setInterNotes] = useState([]);
  const [interNotesLoading, setInterNotesLoading] = useState(true);
  const [interNotesError, setInterNotesError] = useState("");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDc4NDgxZjY0ZWQzNmU4MzA0NmE3ZiIsInR5cGUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AbWVsZGluLmNvIiwiaWF0IjoxNzMzNTEzMjAxLCJleHAiOjE3MzM1OTk2MDF9.6Do4394nxZn-TlWZxCX8weDVf5B9ze45vr_3mhqXx5s";

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

        // Populate extraInfo from the same response
        setExtraInfo({
          companyName: res.data.data.companyName,
          jobPosition: res.data.data.jobPosition,
          companyMobileNumber: res.data.data.companyMobileNumber,
          address: res.data.data.address,
          zipCode: res.data.data.zipCode,
          website: res.data.data.website,
        });

        // Populate InterNotes from the response
        setInterNotes(res.data.data.interNotes || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch lead details");
        setExtraInfoError(
          err.response?.data?.message || "Failed to fetch extra information"
        );
        setInterNotesError(
          err.response?.data?.message || "Failed to fetch internal notes"
        );
      } finally {
        setLoading(false);
        setExtraInfoLoading(false);
        setInterNotesLoading(false);
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
        setActivities(res.data.activities);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchLeadDetails();
    fetchActivities();
  }, [leadId]);

  const renderExtraInfo = (extraInfo) => {
    if (!extraInfo || Object.keys(extraInfo).length === 0) {
      return <p className="text-gray-500">No extra information available.</p>;
    }

    const displayFields = {
      companyName: "Company Name",
      jobPosition: "Job Position",
      companyMobileNumber: "Company Mobile Number",
      address: "Address",
      zipCode: "Zip Code",
      website: "Website",
    };

    return (
      <ul>
        {Object.entries(extraInfo)
          .filter(([key, value]) => value)
          .map(([key, value]) => (
            <li key={key}>
              <strong>{displayFields[key] || key}: </strong>
              {value}
            </li>
          ))}
      </ul>
    );
  };

  const renderInterNotes = (interNotes) => {
    if (!interNotes || interNotes.length === 0) {
      return <p className="text-gray-500">No internal notes available.</p>;
    }

    return (
      <ul className="space-y-2">
        {interNotes.map((note, index) => (
          <li key={index} className="border p-2 rounded bg-gray-50">
            <strong>Note {index + 1}: </strong>
            {note}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 bg-gray-100 p-6">
        <header className="bg-white shadow mb-6 p-4 rounded-lg flex items-center justify-between">
          <button
            className="text-blue-600 font-semibold"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>

          <h1 className="text-xl font-bold text-gray-800">
            {lead?.contactName || "Lead Details"}
          </h1>
        </header>

        <div className="bg-white shadow rounded-lg p-6">
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
                <nav className="flex mb-6 border-b">
                  {["details", "tags", "history"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 ${
                        activeTab === tab
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>

                {activeTab === "details" && (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Details */}
                    <div>
                      <h2 className="font-semibold text-gray-700">Email</h2>
                      <p>{lead.email}</p>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-700">Phone</h2>
                      <p>{lead.phone}</p>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-700">
                        Expected Revenue
                      </h2>
                      <p>{lead.expectedRevenue}</p>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-700">Stage</h2>
                      <p>{lead.stage}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        <div className="mt-6 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-orange-600">
            Extra Information
          </h2>
          {renderExtraInfo(extraInfo)}
        </div>

        <div className="mt-6 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-green-600">InterNotes</h2>
          {interNotesLoading ? (
            <p>Loading internal notes...</p>
          ) : interNotesError ? (
            <p className="text-red-500">{interNotesError}</p>
          ) : (
            renderInterNotes(interNotes)
          )}
        </div>
      </main>

      <aside className="w-1/4 mt-6 bg-white shadow p-4">
        <h2 className="font-bold text-lg mb-4">Activity Log</h2>
        {loadingActivities ? (
          <p>Loading activities...</p>
        ) : activities && Object.keys(activities).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(activities).map(([date, activityList]) => (
              <div key={date}>
                <h3 className="font-semibold text-gray-700">{date}</h3>
                <ul className="pl-4 mt-2 list-disc text-gray-600">
                  {activityList.map((activity, index) => (
                    <li key={index}>
                      <span className="font-medium">{activity.time}</span>:{" "}
                      {activity.details}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No activities available.</p>
        )}
      </aside>
    </div>
  );
};

export default LeadDetails;

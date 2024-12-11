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
    const displayFields = {
      companyName: "Company Name",
      jobPosition: "Job Position",
      companyMobileNumber: "Company Mobile Number",
      address: "Address",
      zipCode: "Zip Code",
      website: "Website",
    };
  
    return (
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(displayFields).map(([key, label]) => (
          <div key={key} className="flex flex-col">
            <strong>{label}:</strong>
            <span>{extraInfo && extraInfo[key] ? extraInfo[key] : "Not Available"}</span>
          </div>
        ))}
      </div>
    );
  };
  

  const renderInterNotes = (interNotes) => (
    <ul>
      {interNotes.map((note, index) => (
        <li key={index}>
          <strong>Note {index + 1}: </strong>
          {note || "No details available for this note."}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen text-orange-600 flex">
      <main className="flex-1 p-6">
        <header className="shadow mb-6 p-4 rounded-lg flex items-center justify-between">
          <button className="font-semibold" onClick={() => window.history.back()}>
            ← Back
          </button>
          <h1 className="font-bold mx-auto">{lead?.contactName || "Lead Details"}</h1>
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
                <nav className="flex mb-6 text-orange-600 border-b">
                  {["details", "tags", "history"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 ${
                        activeTab === tab ? "border-b-2 border-orange-600" : ""
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>

                {activeTab === "details" && (
                  <div className="grid grid-cols-2 text-white gap-4">
                    <div>
                      <h2 className="font-semibold">Email</h2>
                      <p>{lead.email}</p>
                    </div>
                    <div>
                      <h2 className="font-semibold">Phone</h2>
                      <p>{lead.phone}</p>
                    </div>
                    <div>
                      <h2 className="font-semibold">Expected Revenue</h2>
                      <p>{lead.expectedRevenue}</p>
                    </div>
                    <div>
                      <h2 className="font-semibold">Stage</h2>
                      <p>{lead.stage}</p>
                    </div>
                    <div>
                      <h2 className="font-semibold">Sales Person</h2>
                      {lead.salesPerson ? <p>{lead.salesPerson.name}</p> : <p>Not Assigned</p>}
                    </div>
                  </div>
                )}
                {activeTab === "tags" && (
                  <div>
                    {lead?.tags && lead.tags.length > 0 ? (
                      <ul>
                        {lead.tags.map((tags, index) => (
                          <li key={index}>{tags}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No tags available</p>
                    )}
                  </div>
                )}
                {activeTab === "history" && (
                  <div>
                    {lead?.history && lead.history.length > 0 ? (
                      <ul>
                        {lead.history.map((history, index) => (
                          <li key={index}>{history}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No history available</p>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        <div className="mt-6 p-6 rounded shadow">
  <h2 className="text-xl text-orange font-semibold">Extra Information</h2>
  <div className="text-white">
    {renderExtraInfo(extraInfo)}
  </div>
</div>


        <div className="mt-6 p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Internal Notes</h2>
          {renderInterNotes(interNotes)}
        </div>
      </main>

      <aside className="w-1/4 mt-6 shadow p-4">
        <h2 className="font-bold text-lg mb-4">Activity Log</h2>
        {loadingActivities ? (
          <p>Loading activities...</p>
        ) : activities.length > 0 ? (
          <ul>
            {activities.map((activity, index) => (
              <li key={index}>
                <p>{activity.type}</p>
                <small>{activity.date}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No activities found</p>
        )}
      </aside>
    </div>
  );
};

export default LeadDetails;

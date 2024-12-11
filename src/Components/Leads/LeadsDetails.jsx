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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDc4NDgxZjY0ZWQzNmU4MzA0NmE3ZiIsInR5cGUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AbWVsZGluLmNvIiwiaWF0IjoxNzMzOTExNzk1LCJleHAiOjE3MzM5OTgxOTV9.FjwWFuMgVk3X_U2TJqasVikDQh8J3mfeizZKbU7PKSw";

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
        setInterNotes(res.data.data.internalNotes || []);
        console.log(res.data.data.internalNotes)
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
      <ul className="space-y-4 flex-col-reverse">
        {dates.map((date) => (
          <li key={date} className="mb-4">
            <h3 className="font-bold  mb-2">{date}</h3>
            <ul className="space-y-2">
              {activities[date].map((activity, index) => (
                <li
                  key={index}
                  className="rounded p-3 text-white"
                >
                  <p className="font-semibold">{activity.details}</p>
                  <p className="text-sm ">Time: {activity.time}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  };

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
            <span>
              {extraInfo && extraInfo[key] ? extraInfo[key] : "Not Available"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderInterNotes = (interNotes) => {
    if (Array.isArray(interNotes)) {
      // If it's an array, map through and render each note
      return (
        <ul>
          {interNotes.map((note, index) => (
            <li key={index}>
              <strong>Note {index + 1}: </strong>
              {note || "No details available for this note."}
            </li>
          ))}
        </ul>
      );
    } else {
      // If it's a string, render it as a single note
      return (
        <p>
          
          {interNotes || "No details available for this note."}
        </p>
      );
    }
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
                <nav className="flex mb-6 text-orange-600 border-b">
                  {["details"].map((tab) => (
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
                      
                      <p>{lead.stage}</p>
                    </div>
                    <div>
                      <h2 className="font-semibold">Sales Person</h2>
                      {lead.salesPerson ? (
                        <p>{lead.salesPerson.name}</p>
                      ) : (
                        <p>Not Assigned</p>
                      )}
                    </div>
                    
                    <div>
  <h2 className="font-semibold">Tags</h2>
  <div>
    {lead?.tags && lead.tags.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {lead.tags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    ) : (
      <p>No tags available</p>
    )}
  </div>
</div>

           
                    
                  </div>
                )}
                
               
              </div>
            )
          )}
        </div>

        <div className="mt-6 p-6 rounded shadow">
          <h2 className="text-xl text-orange font-semibold">
            Extra Information
          </h2>
          <div className="text-white">{renderExtraInfo(extraInfo)}</div>
        </div>

        <div className="mt-6 p-6 rounded shadow">
  <h2 className="text-xl font-semibold">Internal Notes</h2>
  <div className="text-white" >{renderInterNotes(interNotes)}</div>
  
</div>

      </main>

      <aside className="w-1/4 mt-6 shadow p-4 ">
        <h2 className="font-bold text-white text-lg mb-4">Activity Log</h2>
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

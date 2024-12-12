import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../../ContextApi/UserContext";
import { useNavigate } from "react-router-dom";
import Tags from "../Tags/CreateTag"; // Ensure you have the correct path
import Campaign from "../Campaign/GetAllCampaigns/GetAllCampaigns"; // Ensure you have the correct path

function LeadsDashboard() {
  const { handleLeadId } = useContext(UserContext);
  const [leads, setLeads] = useState({
    Cold: [],
    Warm: [],
    Hot: [],

    Won: [],
    Lost: [],
  });
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filters, setFilters] = useState({
    contactName: "",
    email: "",
    startDate: "",
    endDate: "",
    salesperson: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("campaign"); // New state for active tab
  const navigate = useNavigate();
  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDc4NDgxZjY0ZWQzNmU4MzA0NmE3ZiIsInR5cGUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AbWVsZGluLmNvIiwiaWF0IjoxNzM0MDE2Mzc2LCJleHAiOjE3MzQxMDI3NzZ9.ADeHIe91A0DQWGCDjnVhlypveoeJS-LGniUGeqOEjms"

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const queryString = Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const url = `http://localhost:3000/api/v1/leads/admin-dashboard?${
        queryString || ""
      }`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log;

      const categorizedLeads = {
        Cold: {
          leads: res.data.data.Cold?.leads || [],
          totalRevenue: res.data.data.Cold?.totalExpectedRevenue || 0,
        },
        Warm: {
          leads: res.data.data.Warm?.leads || [],
          totalRevenue: res.data.data.Warm?.totalExpectedRevenue || 0,
        },
        Hot: {
          leads: res.data.data.Hot?.leads || [],
          totalRevenue: res.data.data.Hot?.totalExpectedRevenue || 0,
        },

        Won: {
          leads: res.data.data.Won?.leads || [],
          totalRevenue: res.data.data.Won?.totalExpectedRevenue || 0,
        },
        Lost: {
          leads: res.data.data.Lost?.leads || [],
          totalRevenue: res.data.data.Lost?.totalExpectedRevenue || 0,
        },
      };

      setLeads(categorizedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLeadSelection = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const downloadLeads = async () => {
    const leadIds =
      selectedLeads.length > 0
        ? selectedLeads
        : [
            ...leads.Cold.leads,
            ...leads.Warm.leads,
            ...leads.Hot.leads,

            ...leads.Won.leads,
            ...leads.Lost.leads,
          ].map((lead) => lead.id);

    if (leadIds.length === 0) {
      console.error("No leads to download.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/leads/file-download",
        { leadIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedLeads.length > 0 ? "selected_leads.csv" : "all_leads.csv"
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const renderColumn = (
    title,
    leadsData = { leads: [], totalRevenue: 0 },
    color
  ) => (
    <div className={`w-1/5 p-4 rounded-3xl shadow-md bg-${color}-600`}>
      <h2 className="text-lg font-bold mb-4 text-center text-white">{title}</h2>
      <p className="text-center text-white mb-4">
        Expected Revenue: ${leadsData.totalRevenue || 0}
      </p>
      {leadsData.leads && leadsData.leads.length > 0 ? (
        <ul className="space-y-2">
          {leadsData.leads.map((lead) => (
            <li
              key={lead.id}
              className={`p-4 rounded-2xl shadow-sm bg-white text-black hover:bg-orange-600 cursor-pointer ${
                selectedLeads.includes(lead.id) ? "bg-green-100" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div
                  onClick={() => {
                    handleLeadId(lead.id);
                    navigate("/leaddetails");
                  }}
                >
                  <p className="font-semibold">{lead.contactName}</p>
                  <p>Ph: {lead.phone}</p>
                  <p>Revenue: ${lead.expectedRevenue}</p>
                  <p>Emp: {lead.salesPerson}</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={selectedLeads.includes(lead.id)}
                  onChange={() => handleLeadSelection(lead.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No leads available</p>
      )}
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold text-orange-600 text-center mb-6">
        Leads Dashboard
      </h1>

      <div className="mb-6 sticky top-0 z-10 p-4 shadow-md">
        <div className="flex space-x-4">
          <input
            type="text"
            name="contactName"
            placeholder="Search by Contact Name"
            value={filters.contactName}
            onChange={handleInputChange}
            className="rounded-3xl text-black px-4 py-2 w-1/4"
          />
          <input
            type="text"
            name="salesPerson"
            placeholder="Salesperson"
            value={filters.salesPerson}
            onChange={handleInputChange}
            className="rounded-3xl text-black px-4 py-2 w-1/4"
          />
          <input
            type="email"
            name="email"
            placeholder="Search by Email"
            value={filters.email}
            onChange={handleInputChange}
            className="rounded-3xl text-black px-4 py-2 w-1/4"
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={filters.startDate}
            onChange={handleInputChange}
            className="rounded-3xl text-black px-4 py-2 w-1/4"
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={filters.endDate}
            onChange={handleInputChange}
            className="rounded-3xl text-black px-4 py-2 w-1/4"
          />
          <button
            onClick={downloadLeads}
            className={`bg-orange-500 text-white px-4 py-2 rounded-3xl shadow ${
              leads.Cold.length === 0 &&
              leads.Warm.length === 0 &&
              leads.Hot.length === 0 &&
              leads.Won.length === 0 &&
              leads.Lost.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={
              leads.Cold.length === 0 &&
              leads.Warm.length === 0 &&
              leads.Hot.length === 0 &&
              leads.Won.length === 0 &&
              leads.Lost.length === 0
            }
          >
            Download
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="flex space-x-4">
          {renderColumn("Cold", leads.Cold, )}
          {renderColumn("Warm", leads.Warm, )}
          {renderColumn("Hot", leads.Hot, )}
          {renderColumn("Won", leads.Won, )}
          {renderColumn("Lost", leads.Lost,)}
        </div>
      )}

      <div className="flex justify-left space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("campaign")}
          className={`${
            activeTab === "campaign" ? "bg-orange-500" : "bg-gray-700"
          } text-white px-4 py-2 rounded-3xl`}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`${
            activeTab === "tags" ? "bg-orange-500" : "bg-gray-700"
          } text-white px-4 py-2 rounded-3xl`}
        >
          Tags
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === "campaign" && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-4">Campaigns</h2>
          <Campaign /> ``
        </div>
      )}

      {activeTab === "tags" && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-4">Tags</h2>
          <Tags />
        </div>
      )}
    </div>
  );
}

export default LeadsDashboard;

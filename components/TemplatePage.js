"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TemplatesAdminPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all clients on load
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await axios.get("/api/admin/clients");
        setClients(res.data);
      } catch (err) {
        console.error("Failed to fetch clients");
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  // 2. Fetch templates when a client is selected
  const handleClientClick = async (client) => {
    setSelectedClient(client);
    setTemplates([]); // Clear old data
    try {
      const res = await axios.get(`/api/admin/templates?clientId=${client._id}`);
      setTemplates(res.data);
    } catch (err) {
      console.error("Failed to fetch templates");
    }
  };

  if (loading) return <div className="p-10">Loading Clients...</div>;

  return (
    <div className="p-6">
      {!selectedClient ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Select a Client to Manage</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clients.map((client) => (
              <div 
                key={client._id}
                onClick={() => handleClientClick(client)}
                className="p-6 bg-white border rounded-xl shadow-sm hover:border-blue-500 cursor-pointer transition"
              >
                <h2 className="font-bold text-lg">{client.businessName}</h2>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setSelectedClient(null)}
              className="text-blue-600 hover:underline"
            >
              ← Back to All Clients
            </button>
            <h1 className="text-2xl font-bold">Templates for {selectedClient.businessName}</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ New Template</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {templates.length > 0 ? (
              templates.map((template) => (
                <div key={template._id} className="p-4 bg-white border rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{template.name}</h3>
                    <p className="text-sm text-gray-400">{template.bodyText.substring(0, 50)}...</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Active</span>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-xl">
                No templates found for this client.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
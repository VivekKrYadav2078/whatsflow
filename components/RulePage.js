"use client";
import { useState } from "react";
import ClientCardsView from "./rules/ClientCardsView";
import ClientRulesView from "./rules/ClientRulesView";
import RuleModal from "./RuleModal";
// import { toast } from "sonner"; // Optional: for success messages

export default function RulesPage({initialClients}) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleAddRule = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };
  console.log("Initial ",initialClients)

  const handleSaveRule = async (formData) => {
    try {
      // 1. Determine Method (Look inside the suitcase for an ID)
      const ruleData = JSON.parse(formData.get("ruleData"));
      const method = ruleData._id ? "PUT" : "POST";
      console.log("Data is :",ruleData);
      const url = "api/rules";

      const response = await fetch(url, {
        method,
        // headers: { "Content-Type": "application/json" },
        body: formData,

      });

      if (response.ok) {
        // toast.success(editingRule ? "Rule updated!" : "Rule created!");
        setIsModalOpen(false);
        // Add logic here to refresh your Rules list in ClientRulesView
      }
    } catch (error) {
      console.error("Failed to save rule:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-4">
      {selectedClient === null ? (
        <ClientCardsView onSelectClient={setSelectedClient} initialClients={initialClients}/>
      ) : (
        <ClientRulesView
          client={selectedClient}
          onBack={() => setSelectedClient(null)}
          onEditRule={handleEditRule}
          onAddRule={handleAddRule}
          
        />
      )}

      {/* FIXED PROPS HERE */}
      <RuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
        initialData={editingRule} 
        clientId={selectedClient?.clientId}
        client_Id={selectedClient?._id}

      />
    </div>
  );
}
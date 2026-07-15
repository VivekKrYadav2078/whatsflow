"use client";
import { useState } from "react";
import ClientRulesView from "./rules/ClientRulesView";
import RuleModal from "./RuleModal";

export default function RulesPage({ client }) {
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

  const handleSaveRule = async (formData) => {
    try {
      const ruleData = JSON.parse(formData.get("ruleData"));
      const method = ruleData._id ? "PUT" : "POST";
      const response = await fetch("/api/rules", { method, body: formData });
      if (response.ok) setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save rule:", error);
    }
  };

  return (
    <div className="p-4">
      <ClientRulesView
        client={client}
        onEditRule={handleEditRule}
        onAddRule={handleAddRule}
        // No onBack needed — user has nowhere to go "back" to
      />
      <RuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
        initialData={editingRule}
        clientId={client?.clientId}
        client_Id={client?.id}
      />
    </div>
  );
}


"use client";
import { useState, useEffect } from "react";
import { Trash2, Edit3, Power, Image as ImageIcon, FileText, Plus, MoreVertical, Zap,List } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ClientRulesView({ client, onBack, onEditRule, onAddRule }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("Client", client)
  // Categories definition for the UI
  const ruleCategories = [
    { key: "welcome", label: "Welcome Message", icon: "✋" },
    { key: "keyword", label: "Keyword Rules", icon: "💬" },
    { key: "button_click", label: "Button Rules", icon: "🔘" },
   
  ];

  useEffect(() => {
    const fetchRules = async () => {
      try {
        console.log(client.clientId)
        setLoading(true);
        // FIX: Use client._id here
        const response = await fetch(`/api/rules?clientId=${client.clientId}`);
        const data = await response.json();
        console.log("In rules view: ", data);
        setRules(data.rules || []);
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setLoading(false);
      }
    };
    if (client?.clientId) fetchRules();
  }, [client.clientId]);

  const handleDelete = async (ruleId, clientId) => {
    if (!confirm("Are you sure you want to delete this rule? This will also remove any media from Cloudinary.")) return;

    try {
      // Passing rule and client id in buttons
      const response = await fetch(`/api/rules?id=${ruleId}&clientId=${clientId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRules(rules.filter(r => r._id !== ruleId));
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const toggleStatus = async (rule) => {
    // This is a quick "Patch" to just change the status
    const newStatus = !rule.active;
    try {
      // We reuse your existing PUT logic but only send the ID and new status
      const formData = new FormData();
      // We send the existing rule but flip the 'active' bit
      // We include the mediaUrl so the backend knows NOT to delete it
      formData.append("file", "");
      formData.append("ruleData", JSON.stringify({
        ...rule,
        active: newStatus
      }));
      const response = await fetch("/api/rules", { method: "PUT", body: formData });
      const result = await response.json();
      console.log("Toggle res", response);
      if (response.ok) {
        setRules(rules.map(r => r._id === rule._id ? { ...r, active: newStatus } : r));
      }else{
        // 2. This is where you get "Rule not found" or "Missing identity fields"
      // result.error matches the key you sent from the backend: { error: "..." }
      console.error("Server Error Message:", result.error);
      alert(`Error: ${result.error}`); // Or use a toast notification
      }
    } catch (error) {
      console.error("Toggle failed", error);
    }
  };

  // return (
  //   <div className="p-8">
  //     {/* Header */}
  //     <div className="mb-8 flex justify-between items-start">
  //       <div>
  //         <button onClick={onBack} className="mb-4 px-4 py-2 border rounded-lg hover:bg-slate-50 transition">← Back</button>
  //         <h2 className="text-3xl font-bold text-slate-900">{client.name }</h2>
  //         <p className="text-slate-600">{client.whatsappNumber}</p>
  //       </div>
  //       <button onClick={onAddRule} className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">+ Add Rule</button>
  //     </div>

  //     {loading ? (
  //       <div className="text-center py-20">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
  //         <p className="mt-4 text-slate-500">Fetching your rules...</p>
  //       </div>
  //     ) : (
  //       <div className="space-y-10">
  //         {ruleCategories.map((category) => {
  //           // Filter rules that belong to this category
  //           const filteredRules = rules.filter(r => r.triggerType === category.key);

  //           return (
  //             <div key={category.key}>
  //               <div className="flex items-center gap-2 mb-4">
  //                 <span className="text-2xl">{category.icon}</span>
  //                 <h3 className="text-xl font-bold">{category.label}</h3>
  //                 <span className="bg-slate-100 px-2 py-1 rounded text-sm">{filteredRules.length}</span>
  //               </div>

  //               {filteredRules.length > 0 ? (
  //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                   {filteredRules.map((rule) => (
  //                     <div key={rule._id} className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
  //                       <div className="flex justify-between items-start">
  //                         <div>
  //                           <h4 className="font-bold text-slate-900">{rule.ruleName}</h4>
  //                           <p className="text-sm text-slate-500">Trigger: {rule.keywords || rule.buttonId || "N/A"}</p>
  //                         </div>
  //                         <button onClick={() => onEditRule(rule)} className="text-blue-600 text-sm font-bold">Edit</button>
  //                       </div>
  //                     </div>
  //                   ))}
  //                 </div>
  //               ) : (
  //                 <div className="py-6 bg-slate-50 rounded-xl border border-dashed text-center">
  //                   <p className="text-slate-400 text-sm">No {category.label} yet</p>
  //                 </div>
  //               )}
  //             </div>
  //           );
  //         })}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-end border-b pb-6">
        <div>
          <button onClick={onBack} className="group flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4 text-sm font-medium">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Clients
          </button>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{client.name}</h2>
          <p className="text-slate-500 font-mono mt-1">{client.whatsappNumber}</p>
        </div>
        <button onClick={onAddRule} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Rule
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mb-4"></div>
          <p className="text-slate-400 font-medium">Nedrix is syncing your rules...</p>
        </div>
      ) : (
        <div className="grid gap-12">
          {ruleCategories.map((category) => {
            const filteredRules = rules.filter(r => r.triggerType === category.key);

            return (
              <section key={category.key}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="p-2 bg-slate-100 rounded-lg text-xl">{category.icon}</span>
                  <h3 className="text-xl font-extrabold text-slate-800">{category.label}</h3>
                  <div className="h-px flex-1 bg-slate-100 ml-4"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border">
                    {filteredRules.length} Rules
                  </span>
                </div>

                {filteredRules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* {filteredRules.map((rule) => (
                      <div key={rule._id} className={`group bg-white rounded-3xl border-2 p-6 transition-all duration-300 hover:border-blue-400 hover:shadow-xl ${!rule.active ? 'opacity-75 grayscale-[0.5]' : 'border-slate-100'}`}>
                        
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-2 rounded-xl ${rule.active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Power className="w-5 h-5" />
                          </div>
                          <div className="flex items-center gap-2">
                            {rule.mediaUrl && (
                               <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                                 {rule.mediaType === 'image' ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                 Media
                               </div>
                            )}
                            <Switch checked={rule.active} onCheckedChange={() => toggleStatus(rule)} />
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{rule.ruleName}</h4>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                           <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter">Trigger</span>
                           <span className="truncate max-w-[150px] italic">"{rule.keywords || rule.buttonId || 'Always'}"</span>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                          <button onClick={() => onEditRule(rule)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition-colors">
                            <Edit3 className="w-3 h-3" /> Edit Rule
                          </button>
                          <button onClick={() => handleDelete(rule._id,rule.clientId)} className="p-2.5 rounded-xl border-2 border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))} */}

                    {filteredRules.map((rule) => (
                      <div key={rule._id} className={`group relative bg-white rounded-3xl border-2 p-5 transition-all duration-300 hover:shadow-xl ${!rule.active ? 'opacity-70 grayscale-[0.5] border-slate-100' : 'border-slate-100 hover:border-green-400'}`}>

                        {/* 1. Top Row: Status & Type Indicators */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col gap-1">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider w-fit ${rule.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                              {rule.active ? '● Active' : '○ Paused'}
                            </span>
                            <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-green-600 transition-colors">
                              {rule.ruleName}
                            </h4>
                          </div>
                          <Switch checked={rule.active} onCheckedChange={() => toggleStatus(rule)} className="data-[state=checked]:bg-green-500" />
                        </div>

                        {/* 2. Middle Section: The "Brain" (Trigger & Response Preview) */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 mb-6">
                          {/* Trigger Logic */}
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <p className="text-xs font-bold text-slate-600 truncate">
                              {rule.triggerType === 'keyword' ? <span className="font-bold">"If message has: "{rule.keywords || "Any incoming text"}</span>:
                                rule.triggerType === 'button_click' ? <span className="font-bold">"If message has: "{rule.buttonId || "Any incoming Button text"}</span> :
                                  'First time greeting'} 
                            </p>
                          </div>

                          {/* THE PIECE OF CAKE: Response Preview */}
                          <div className="relative">
                            <p className="text-xs text-slate-500 bg-slate-90 line-clamp-2 italic leading-relaxed pl-3 border-l-2 border-slate-200">
                              "{rule.responseText || "No text response set..."}"
                            </p>
                          </div>

                          {/* Visual Media/Interactive Badges */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {rule.mediaUrl && (
                              <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                {rule.mediaType === 'image' ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                Header
                              </div>
                            )}
                            {rule.buttons?.length > 0 && (
                              <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                <Plus className="w-3 h-3" /> {rule.buttons.length} Buttons
                              </div>
                            )}
                            {rule.menuItems?.length > 0 && (
                              <div className="flex items-center gap-1 bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                <List className="w-3 h-3" /> List Menu
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 3. Footer Actions: Surgical & Clean */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEditRule(rule)}
                            className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                          >
                            <Edit3 className="w-3 h-3" /> Quick Edit
                          </button>
                          <button
                            onClick={() => handleDelete(rule._id, rule.clientId)}
                            className="p-2.5 rounded-xl border-2 border-slate-300 text-slate-800 hover:text-red-600 hover:border-red-300 hover:bg-red-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
                    <p className="text-slate-400 text-sm font-medium">No active automations in this category</p>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
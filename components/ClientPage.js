
"use client"

import { useState } from "react"
import { Eye, EyeOff, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"

export default function ClientsPage({ initialClients }) {
  const [clients, setClients] = useState(initialClients || [])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [isSaving, setIsSaving] = useState(false);
  const[addRule,setAddRule]=useState(false);
  // React Hook Form Setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const openEditModal = (client) => {
    reset(client) // Fills the form with existing client data
    setAddRule(false);
    setIsEditOpen(true)
  }
  
  const handleAddRule=()=>{
    setAddRule(true);
    setIsEditOpen(true);
  }

  const handleCancel=()=>{
    setIsEditOpen(false);
    setAddRule(false);

  }

  const onUpdateSubmit = async (data) => {
    console.log("Updating Client:", data)
    // Here you would call your API: fetch('/api/clients', { method: 'PUT', body: JSON.stringify(data) })
    setIsSaving(true);
  try {
    const response = await fetch('/api/client-data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      
      // Update the local state so the table refreshes instantly
      setClients(clients.map(c => c.id === data.id ? data : c));
      
      setIsEditOpen(false);
      // Optional: Add a toast notification here
    } else {
      alert("Failed to update client");
    }
  } catch (error) {
    console.error("Error updating:", error);
  } finally {
    setIsSaving(false);
    
  }
};
    
  

  const toggleClientStatus = (id) => {
    setClients(clients.map((c) =>
      c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c
    ))
  }
console.log(clients);
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex flex-row justify-between ">
          <h2 className="text-3xl font-bold text-slate-900">Clients</h2>
          <button
          onClick={handleAddRule}
          className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-700 transition"
        >
          + Add Rule
        </button>
         
        </div>
        
        <p className="text-slate-600 mt-2">Manage your WhatsApp business clients</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Client Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Client ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">WhatsApp Number</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-slate-200 hover:bg-slate-50 transition text-sm">
                <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{client.clientId}</td>
                <td className="px-6 py-4 text-slate-600">{client.whatsappNumber}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    client.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(client)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button 
                    variant={client.status === "Active" ? "destructive" : "default"} 
                    size="sm"
                    onClick={() => toggleClientStatus(client.id)}
                  >
                    {client.status === "Active" ? "Pause" : "Resume"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Client Name</label>
              <Input {...register("name", { required: true })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Client Id</label>
              <Input {...register("clientId", { required: true })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Number</label>
              <Input {...register("wpnumber", { required: true })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Access Token</label>
              <div className="relative">
                <Input 
                  type={showToken ? "text" : "password"} 
                  {...register("accessToken")} 
                  className="pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
    {isSaving ? "Saving..." :addRule?"Add Client" :"Update Client"}
  </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
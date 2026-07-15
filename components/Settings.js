"use client"
import { useState } from "react"
import { Eye, EyeOff, Save, AlertCircle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"

export default function SettingsPage({ client }) {
  const [showToken, setShowToken] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // "success" | "error" | null

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      name: client?.name || "",
      whatsappNumber: client?.whatsappNumber || "",
      clientId: client?.clientId || "",
      accessToken: "",
    }
  })

  const onSubmit = async (data) => {
    setIsSaving(true)
    setSaveStatus(null)
    try {
      const response = await fetch("/api/client-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: client?.id }),
      })
      if (response.ok) {
        setSaveStatus("success")
        setTimeout(() => setSaveStatus(null), 3000)
      } else {
        setSaveStatus("error")
      }
    } catch (err) {
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your WhatsApp business credentials</p>
      </div>

      {/* Save status toast */}
      {saveStatus === "success" && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl font-medium text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" /> Settings saved successfully!
        </div>
      )}
      {saveStatus === "error" && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl font-medium text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" /> Failed to save. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Business Info Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Business Info</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Business Name</label>
            <Input
              {...register("name", { required: true })}
              placeholder="e.g. My Shop"
              className="h-11 rounded-xl"
            />
            {errors.name && <p className="text-xs text-red-500">Required</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">WhatsApp Number</label>
            <Input
              {...register("whatsappNumber", { required: true })}
              placeholder="e.g. +91 98765 43210"
              className="h-11 rounded-xl"
            />
            {errors.whatsappNumber && <p className="text-xs text-red-500">Required</p>}
          </div>
        </div>

        {/* WhatsApp API Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">WhatsApp API Credentials</p>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Client ID</label>
            <Input
              {...register("clientId", { required: true })}
              placeholder="Your WhatsApp Business Client ID"
              className="h-11 rounded-xl font-mono text-sm"
            />
            {errors.clientId && <p className="text-xs text-red-500">Required</p>}
            <p className="text-xs text-slate-400">This is your Phone Number ID from Meta Developer Console.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Access Token</label>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                {...register("accessToken")}
                placeholder="Leave blank to keep existing token"
                className="h-11 rounded-xl pr-12 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-slate-400">Leave blank to keep your existing token unchanged.</p>
          </div>
        </div>

        {/* Bot Status Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Bot Status</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Currently: <span className={client?.status === "Active" ? "text-green-600" : "text-red-500"}>{client?.status}</span></p>
              <p className="text-xs text-slate-400 mt-1">To pause/resume your bot, contact support or use the toggle below.</p>
            </div>
            <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
              client?.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}>
              {client?.status === "Active" ? "● Active" : "○ Paused"}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          disabled={isSaving}
          className="w-full h-12 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-base shadow-lg shadow-green-200 transition-all"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Settings
            </span>
          )}
        </Button>
      </form>
    </div>
  )
}
"use client"
import { useState, useEffect } from "react"
import { Zap, Plus, ArrowRight, Activity, CheckCircle, PauseCircle, AlertCircle } from "lucide-react"

export default function HomePage({ client, onNavigate }) {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    paused: 0,
    loading: true
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/rules?clientId=${client.clientId}`)
        const data = await res.json()
        const rules = data.rules || []
        setStats({
          total: rules.length,
          active: rules.filter(r => r.active).length,
          paused: rules.filter(r => !r.active).length,
          loading: false
        })
      } catch (err) {
        setStats(s => ({ ...s, loading: false }))
      }
    }
    if (client?.clientId) fetchStats()
  }, [client])

  const botIsActive = client?.status === "Active"

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900">
          Good to see you 👋
        </h2>
        <p className="text-slate-500 mt-1">Here's what's happening with your WhatsApp bot.</p>
      </div>

      {/* BOT STATUS CARD — the most important thing */}
      <div className={`rounded-3xl p-6 mb-6 border-2 flex items-center justify-between ${
        botIsActive
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
          : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
            botIsActive ? "bg-green-500" : "bg-red-400"
          }`}>
            {botIsActive ? "🟢" : "🔴"}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Bot Status</p>
            <h3 className={`text-2xl font-black ${botIsActive ? "text-green-800" : "text-red-700"}`}>
              {botIsActive ? "Your bot is live!" : "Bot is paused"}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5 font-mono">{client?.whatsappNumber}</p>
          </div>
        </div>
        <div className="text-right">
          {botIsActive ? (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Receiving messages
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              Not responding
            </div>
          )}
          <p className="text-xs text-slate-400 mt-2">
            Change in <button onClick={() => onNavigate("settings")} className="text-blue-500 underline">Settings</button>
          </p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Rules",
            value: stats.total,
            icon: <Zap className="w-5 h-5" />,
            color: "bg-blue-50 text-blue-600 border-blue-100",
            iconBg: "bg-blue-100"
          },
          {
            label: "Active Rules",
            value: stats.active,
            icon: <CheckCircle className="w-5 h-5" />,
            color: "bg-green-50 text-green-700 border-green-100",
            iconBg: "bg-green-100"
          },
          {
            label: "Paused Rules",
            value: stats.paused,
            icon: <PauseCircle className="w-5 h-5" />,
            color: "bg-amber-50 text-amber-700 border-amber-100",
            iconBg: "bg-amber-100"
          },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border-2 p-5 ${stat.color}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.iconBg}`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-black">
              {stats.loading ? (
                <span className="inline-block w-8 h-7 bg-current opacity-10 rounded animate-pulse"></span>
              ) : stat.value}
            </p>
            <p className="text-xs font-bold uppercase tracking-wide mt-1 opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => onNavigate("automations")}
          className="group flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-green-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-sm">Add Automation</p>
              <p className="text-xs text-slate-500">Create a new reply rule</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => onNavigate("automations")}
          className="group flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-sm">View Automations</p>
              <p className="text-xs text-slate-500">Manage all your rules</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* EMPTY STATE NUDGE — only show if no rules yet */}
      {!stats.loading && stats.total === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 p-10 text-center bg-white">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Your bot has no rules yet!</h3>
          <p className="text-slate-500 text-sm mb-6">
            Create your first automation to start replying to customers automatically.
          </p>
          <button
            onClick={() => onNavigate("automations")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold transition shadow-lg shadow-green-200"
          >
            ⚡ Create First Automation
          </button>
        </div>
      )}

      {/* SETUP CHECKLIST — helpful for new users */}
      {!stats.loading && stats.total > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Setup Checklist</p>
          <div className="space-y-3">
            {[
              { done: true,          label: "Connected your WhatsApp number" },
              { done: stats.total > 0, label: "Created at least one automation" },
              { done: stats.active > 0 && botIsActive, label: "Bot is live and responding" },
              { done: stats.total >= 3,  label: "Added welcome + keyword + fallback rules" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.done ? "bg-green-500" : "bg-slate-100"
                }`}>
                  {item.done
                    ? <CheckCircle className="w-3 h-3 text-white" />
                    : <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  }
                </div>
                <p className={`text-sm font-medium ${item.done ? "text-slate-700 line-through opacity-60" : "text-slate-800"}`}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
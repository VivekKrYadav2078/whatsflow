"use client"

export default function Sidebar({ activeSection, setActiveSection, client }) {
  const navItems = [
    { id: "home",        label: "Home",        icon: "🏠" },
    { id: "automations", label: "Automations",  icon: "⚡" },
    { id: "settings",    label: "Settings",     icon: "⚙️" },
  ]

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center text-white font-black text-lg shadow">
            W
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">WhatsApp Hub</h1>
          </div>
        </div>
        {/* User's business info */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <p className="text-sm font-bold text-slate-800 truncate">{client?.name}</p>
          <p className="text-xs text-green-600 font-medium mt-0.5">📱 {client?.whatsappNumber}</p>
          <span className={`inline-block mt-2 text-[10px] font-black px-2 py-0.5 rounded-full ${
            client?.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}>
            {client?.status === "Active" ? "● Bot Active" : "○ Bot Paused"}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Menu</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                  activeSection === item.id
                    ? "bg-green-50 text-green-800 border border-green-200 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
                {activeSection === item.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout + Footer */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition flex items-center gap-3 text-sm"
        >
          <span>🚪</span> Logout
        </button>
        <p className="text-[10px] text-slate-400 text-center mt-3">WhatsApp Automation v1.0</p>
      </div>
    </aside>
  )
}
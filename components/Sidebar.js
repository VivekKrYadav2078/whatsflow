"use client"

export default function Sidebar({ activeSection, setActiveSection }) {
  const navItems = [
    { id: "clients", label: "Clients", icon: "👥" },
    { id: "rules", label: "Rules", icon: "⚙️" },
  ]

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login"; // Force a hard refresh to clear state
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">WhatsApp Hub</h1>
        <p className="text-sm text-slate-500 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === item.id ? "bg-blue-100 text-blue-900" : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
          <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-amber-400 cursor-pointer">
            Logout
          </button>
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200 bg-white">
        <p className="text-xs text-slate-500 text-center">WhatsApp Automation v1.0</p>
      </div>
    </aside>
  )
}

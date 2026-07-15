"use client"
import { useState } from "react"
import Sidebar from "./Sidebar"
import HomePage from "./Homepage"
import RulesPage from "./RulePage"
import Settings from "./Settings"

export default function Dashboard({ client }) {
  const [activeSection, setActiveSection] = useState("home")

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} client={client} />
      <main className="flex-1 overflow-auto">
        {activeSection === "home" && <HomePage client={client} onNavigate={setActiveSection} />}
        {activeSection === "automations" && <RulesPage client={client} />}
        {activeSection === "settings" && <Settings client={client} />}
      </main>
    </div>
  )
}
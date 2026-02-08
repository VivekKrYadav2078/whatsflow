"use client"
import { useState } from "react"
import Sidebar from "../components/Sidebar"
import ClientsPage from "../components/ClientPage"
import RulesPage from "../components/RulePage"

export default function Dashboard({initialClients}) { 
  const [activeSection, setActiveSection] = useState("clients")

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {activeSection === "clients" && <ClientsPage initialClients={initialClients}/>}
        {activeSection === "rules" && <RulesPage initialClients={initialClients} />}
      </main>
    </div>
  )
}

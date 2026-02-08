"use client"

// // Dummy client data for rules page
// const DUMMY_CLIENTS = [
//   {
//     id: 1,
//     name: "Tech Startup Inc",
//     whatsappNumber: "+1 (555) 123-4567",
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "E-commerce Store",
//     whatsappNumber: "+1 (555) 234-5678",
//     status: "Active",
//   },
//   {
//     id: 3,
//     name: "Digital Agency",
//     whatsappNumber: "+1 (555) 345-6789",
//     status: "Paused",
//   },
//   {
//     id: 4,
//     name: "Healthcare Services",
//     whatsappNumber: "+1 (555) 456-7890",
//     status: "Active",
//   },
//   {
//     id: 5,
//     name: "Education Hub",
//     whatsappNumber: "+1 (555) 567-8901",
//     status: "Active",
//   },
// ]

export default function ClientCardsView({ onSelectClient ,initialClients}) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Manage Rules</h2>
        <p className="text-slate-600 mt-2">Select a client to manage their automation rules</p>
      </div>

      {/* Client Cards Grid */}
      {!initialClients ||  initialClients?.length === 0 ? (
  <div className="text-center py-20 bg-slate-100 rounded-xl border-2 border-dashed">
    <p className="text-slate-500">No clients found. Go to the Clients tab to add one!</p>
  </div>
) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialClients?.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelectClient(client)}
            className="bg-white rounded-lg shadow border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition transform hover:scale-105"
          >
            {/* Client Info */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">{client.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{client.whatsappNumber}</p>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  client.status.toLowerCase() === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {client.status}
              </span>
            </div>

            {/* Action Button */}
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Manage Rules
            </button>
          </div>
        ))}
      </div>
)
}
</div>
  )
}

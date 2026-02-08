import dbConnect from "@/lib/db";
import Client from "@/models/Client";
import ClientsPage from "@/components/ClientsPage"; // Adjust path to where your UI file is

export default async function Page() {
  await dbConnect();

  // 1. Fetch data directly from the DB (much faster than an internal API call)
  const rawClients = await Client.find({}).lean();
 console.log("In Page :",rawClients)
  // 2. Format the data (MongoDB _id to string) to avoid serialization errors
  const clients = rawClients.map(client => ({
    id:client._id.toString(),
    clientId: client.clientId,
    name: client.name,
    whatsappNumber: client.whatsappNumber,
    status: client.status || "",
  }));

  // 3. Pass it to your "use client" component
  return <ClientsPage initialClients={clients} />;
}
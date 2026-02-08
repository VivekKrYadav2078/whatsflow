import dbConnect from "@/lib/db.js";
import Client from "@/model/Client.js";
import Dashboard from "@/components/Dashboard";
import { cookies } from "next/headers"; // 👈 Add this
import { redirect } from "next/navigation"; // 👈 Add this

export default async function Page() {
  // 1. THE LOCK: Check for the token before doing ANYTHING
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    // No token? Kick them out to the login page immediately
    redirect("/login");
  }

  // 2. DATABASE WORK: Only happens if user is authenticated
  await dbConnect();

  const rawClients = await Client.find({}).lean();
  
  const clients = rawClients.map(client => ({
    id: client._id.toString(),
    clientId: client.clientId,
    name: client.name,
    whatsappNumber: client.whatsappNumber,
    status: client.status || "",
  }));

  return <Dashboard initialClients={clients} />;
}
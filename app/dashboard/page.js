import dbConnect from "@/lib/db.js";
import Client from "@/model/Client.js";
import Dashboard from "@/components/Dashboard";
import { cookies } from "next/headers"; // 👈 Add this
import { redirect } from "next/navigation"; // 👈 Add this
import jwt from "jsonwebtoken" 

export default async function Page() {
  // 1. THE LOCK: Check for the token before doing ANYTHING
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    // No token? Kick them out to the login page immediately
    redirect("/login");
  }
  // Decode token to get the user's ID
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id; // adjust based on your token payload
    console.log("Userid is",userId)
  } catch {
    redirect("/login");
  }
  // 2. DATABASE WORK: Only happens if user is authenticated
  await dbConnect();

// Fetch ONLY this user's client (assuming Client has a userId/owner field)
  const rawClient = await Client.findOne({ userId }).lean();


  if (!rawClient) redirect("/onboarding"); // or show a setup page
  

 const client = {
    id: rawClient._id.toString(),
    clientId: rawClient.clientId,
    name: rawClient.name,
    whatsappNumber: rawClient.whatsappNumber,
    status: rawClient.status || "",
  };
  return <Dashboard client={client} />;
}
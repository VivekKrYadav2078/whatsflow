import connectDB from "@/lib/db"; // Your DB connection utility
import Client from "@/model/Client"; // Path to the schema you just shared
import { NextResponse } from "next/server";
import mongoose from "mongoose";
// ⚠️ Update these two paths if your files are in a different folder!
// import Client from "../../../models/Client";
export async function GET(req) {
  try {
    await connectDB();
    // await connectDB();
    console.log("🚀 Inside server - Connected to DB safely!");
    const validUserId="6a16ad2bc8e490fe8c7e5564" 
   
    const dummyClient = await Client.create({
      clientId: "986038557922818", // Paste Phone number ID here
      userId: new mongoose.Types.ObjectId(validUserId),  // Paste your actual test User's MongoDB _id
      name: "Vivek Kumar Yadav", 
      whatsappNumber: "6291509765",        // Your WhatsApp phone number
      accessToken: "EAAWYnkgz4HABQjkzLOE32pcPZA35HOtgUZC3ccBxZB4hbEwPnzAdS6XtR7xc2cZBOfoVIjnC5AWqPXGDVYdgstAY9r8ihzAAeLymtYKtxNZAyG1u9wLiwCwGXZALVsXzSh8nDZC97634SUFTNrisybKwdHdnFcLAa3H9JUd7ZCtZCrsDKVtpZClmB8QENJY5ibiokPYnfyJXlYZBBFowd9UVX4KK4uKOcTNt3aZCUQnLsvR5XZBZAy9EoMO4XuqbWSqn68bKdbzCD7aE0hPytUZB9KHdq0Pgy8k", // Paste System User Token
      active: true
    });

   console.log("✅ Client record successfully inserted into MongoDB!");

    return NextResponse.json({ 
      success: true, 
      message: "Client seeded successfully!", 
      dummyClient 
    });

  } catch (error) {
    console.error("❌ Database Injection Failure:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
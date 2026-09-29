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
    // console.log("🚀 Inside server - Connected to DB safely!");
    const validUserId=process.env.TEST_USER_ID
   
    const dummyClient = await Client.create({
      clientId: process.env.TEST_CLIENT_ID, // Paste Phone number ID here
      userId: new mongoose.Types.ObjectId(validUserId),  // Paste your actual test User's MongoDB _id
      name: process.env.TEST_NAME, 
      whatsappNumber: process.env.TEST_NUMBER,        // Your WhatsApp phone number
      accessToken: process.env.TEST_ACCESS_TOKEN, // Paste System User Token
      active: process.env.TEST_ACTIVE
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
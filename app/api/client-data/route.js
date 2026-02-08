// src/app/api/clients/route.js
import dbConnect from "@/lib/db";
import Client from "@/model/Client";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await dbConnect();
    const data = await req.json();
    console.log("IN api:", data);

    const { id,clientId, name, whatsappNumber, accessToken,status } = data;
    const updateFields={};
    
    if(name) updateFields.name=name;
    if(whatsappNumber) updateFields.whatsappNumber=whatsappNumber;
    if(clientId) updateFields.clientId=clientId;
    if(accessToken) updateFields.accessToken=accessToken;
    if(status) updateFields.status=status;

    // Find the client by ID and update with new data
   const updatedClient = await Client.findByIdAndUpdate(
      id,
     { $set: updateFields }, 
      { new: true, runValidators: true }// returns the updated document
    ); 

    if (!updatedClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
console.log("Snending back respons")
    return NextResponse.json({ message: "Updated successfully", client: updatedClient });
  } catch (error) {
    console.log("Error: ", error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
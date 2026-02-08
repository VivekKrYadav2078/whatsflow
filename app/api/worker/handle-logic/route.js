import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import dbConnect from "@/lib/db";
// import Lead from "@/model/Lead";
// import Rule from "@/model/Rule"; 
import Client from "@/model/Client";
// import { sendWhatsAppMessage } from "@/utils/whatsappSender";
import { processRules } from "@/lib/helper/processRules";

async function handler(req) {
  try {
    const cleanData = await req.json();
    const { from, name, text, metadata,type,messageId } = cleanData;
    const { clientId } = metadata; // This is the phone_number_id

    const userPhone=from;

    await dbConnect();
     
    // Check if client is valid or not and active or not
    const client = await Client.findOne({ clientId });
    if (!client || !client.active) {
         return new Response("Client is invalid or inactive", { status: 200 });
    }

    await processRules(clientId, text, type, userPhone,client.accessToken);

    return new Response("Success", { status: 200 });

  }catch(error){
    console.error("Worker Error:", error);
    // ⚠️ CRITICAL: Return 500 so QStash knows it failed and will RETRY
    return new Response("Retry later", { status: 500 });
  }

}
export const POST = verifySignatureAppRouter(handler);

//     // 🟢 1. LEAD AUTO-SAVE
//     // // If they exist, update their name and last seen. If not, create them.
//     // const lead = await Lead.findOneAndUpdate(
//     //   { phoneNumber: from, ownerId: clientId },
//     //   { 
//     //     $set: { name, lastInteraction: new Date() },
//     //     $setOnInsert: { status: "BOT" } 
//     //   },
//     //   { upsert: true, new: true }
//     // );

//     // 🟢 2. HUMAN HANDOVER CHECK
//     // If the status is 'HUMAN', we stop here so the bot doesn't interfere.
//     if (lead.status === "HUMAN") {
//       console.log(`Skipping bot for ${from} (Human Handover Active)`);
//       return new Response("Human mode active", { status: 200 });
//     }

//     // 🟢 3. RULES ENGINE
//     // Look for a rule that matches the incoming text exactly (Case-Insensitive)
//     const matchingRule = await Rule.findOne({
//       ownerId: clientId,
//       trigger: { $regex: new RegExp(`^${text.trim()}$`, "i") }
//     });

//     if (matchingRule) {
//       // 🟢 4. SEND THE REPLY
//       // We pass the clientId (phone_number_id) so Meta knows who is sending the reply
//       await sendWhatsAppMessage(
//         clientId, 
//         from, 
//         matchingRule.response
//       );
//       console.log(`Successfully replied to ${from}`);
//     } else {
//       console.log(`No rule found for: "${text}"`);
//     }

//     return new Response("Success", { status: 200 });

//   } catch (error) {
//     console.error("Worker Logic Error:", error);
//     // ⚠️ Return 500 so QStash knows to RETRY this task automatically
//     return new Response("Worker Failed", { status: 500 });
//   }
// }

// 🛡️ SECURITY: This ensures ONLY QStash can trigger this route

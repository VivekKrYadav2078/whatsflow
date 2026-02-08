import axios from "axios";
import Client from "@/model/Client";
import dbConnect from "@/lib/db";

/**
 * Sends a prepared payload to the Meta WhatsApp Business API.
 * @param {string} clientId - The WhatsApp Business Phone Number ID.
 * @param {object} payload - The JSON body for the WhatsApp API.
 */
export async function sendWhatsAppMessage(clientId, payload,access_token) {
  try {

    await dbConnect();

    // 💡 In production, you should fetch the token from your Database
    // based on the clientId. For now, you can use process.env.WHATSAPP_TOKEN
    // const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const VERSION = "v21.0"; // Use the latest Meta API version

    const url = `https://graph.facebook.com/${VERSION}/${clientId}/messages`;

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    

    console.log(`✅ Message sent to ${payload.to}: ${response.data.messages[0].id}`);
    return response.data;

  } catch (error) {
    // 💡 Axios catches 400, 401, 500 errors here automatically
    const metaError = error.response?.data?.error?.message || error.message;
    const statusCode = error.response?.status;

    console.error(`❌ Meta API Error (${statusCode}):`, metaError);
    
    // 🔥 Check if it's REALLY a token issue before throwing
    if (statusCode === 401) {
       console.error("🚨 ALERT: Your Meta Token is actually expired or invalid.");
    }

    throw new Error(`WhatsApp API failed: ${metaError}`);
  
  }
}
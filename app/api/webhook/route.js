import { processIncomingMessage } from "@/lib/messageProcessor";
import { Client } from "@upstash/qstash";

export function GET(req) {
  const { searchParams } = new URL(req.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" &&token === process.env.VERIFY_TOKEN)

  {  console.log('Webhook verified successfully');
    // Return the challenge as plain text (Required by Meta)
    return new Response(challenge, { status: 200 });
  }

 console.error("Webhook verification failed ");
  return new Response("Forbidden", { status: 403 });
}

const qstash = new Client({baseUrl: "https://qstash-eu-central-1.upstash.io",
                         token: process.env.QSTASH_TOKEN });

export async function POST(req) {
  // FAST ACK
  console.log("Webhook received ")
//   new Response("Success",{status:200});
 try {
    const body = await req.json().catch(() => null);
    if (!body) return new Response("No Body", { status: 200 });
   
   //  Extract the clean data immediately (Synchronous/Fast)
    const cleanMessage=processIncomingMessage(body);
   
   // If it's a status update (read/delivered), we just say OK and stop
    if(!cleanMessage) return new Response("OK", { status: 200 });

    //  Push the CLEAN data to QStash
     qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/worker/handle-logic`,
      body:cleanMessage
    });


    //  {
    //     leadPhone: cleanMessage.from,  // User's phone number
    //     text: cleanMessage.text,  // The actual string to match against rules
    //     type: cleanMessage.type, // button, text, interactive, etc.
    //     metadata: cleanMessage.metadata
    //   },

    return new Response("OK", { status: 200 });

 }catch(err){

    return new Response("OK", { status: 200 });

 }


}
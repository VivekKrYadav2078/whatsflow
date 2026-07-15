// import { NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(req) {
//     console.log("In the server bro")
//   try {
//     // 1. Catch the code sent from your React frontend
//     // 1. Catch the code AND the redirectUri sent from your React frontend
//     const body = await req.json();
//     console.log(body)
//     const { code, redirectUri } = body;

//     if (!code) {
//       return NextResponse.json({ error: "Authorization code missing" }, { status: 400 });
//     }

//     // 2. Exchange the code for the client token via Meta Graph API
//     const tokenExchangeUrl = `https://graph.facebook.com/v21.0/oauth/access_token`;
//     const tokenResponse = await axios.get(tokenExchangeUrl, {
//       params: {
//         client_id: process.env.NEXT_PUBLIC_META_APP_ID,
//         client_secret: process.env.META_APP_SECRET, 
//         code: code,
//         // redirect_uri: redirectUri // 🚀 Meta DEMANDS this parameter!
//       }
//     });

//     const clientAccessToken = tokenResponse.data.access_token;
//     console.log(tokenResponse)
//     // Meta v4 Embedded Signup returns the WABA ID and Phone ID directly in this response
//     const apiData = tokenResponse.data.whatsapp_business_api_data;
//     const wabaId = tokenResponse.data.waba_id || apiData?.waba_id;
//     const phoneId = tokenResponse.data.phone_number_id || apiData?.phone_number_id;

//     if (!wabaId || !phoneId) {
//       return NextResponse.json({ error: "Failed to parse WABA ID or Phone ID from Meta" }, { status: 422 });
//     }

//     // 3. Optional but recommended: Register the number instantly
//     // (This turns the number "on" for messaging)
//     try {
//       await axios.post(
//         `https://graph.facebook.com/v21.0/${phoneId}/register`,
//         { messaging_product: "whatsapp", pin: "123456" }, // 6-digit pin of your choice
//         { headers: { Authorization: `Bearer ${clientAccessToken}` } }
//       );
//     } catch (regError) {
//       console.warn("Number registration skipped or failed. You may need to register it manually.", regError.response?.data || regError.message);
//     }

//     // 4. Subscribe your Meta App to this specific user's Webhooks
//     // (So your backend can listen for incoming messages)
//     try {
//       await axios.post(
//         `https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps`,
//         {},
//         { headers: { Authorization: `Bearer ${clientAccessToken}` } }
//       );
//     } catch (subError) {
//       console.warn("Webhook subscription failed.", subError.response?.data || subError.message);
//     }

//     // 5. TODO: Save this data to your database!
//     // Example: await db.collection("users").updateOne({ id: currentUserId }, { $set: { wabaId, phoneId, clientAccessToken } });

//     // 6. Tell the frontend it was a massive success
//     return NextResponse.json({ success: true, wabaId, phoneId }, { status: 200 });

//   } catch (error) {
//     console.error("Meta Token Exchange Error:", error.response?.data || error.message);
//     return NextResponse.json(
//       { error: "Failed to exchange Meta code for tokens" }, 
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// import dbConnect from "@/lib/db";
// import Client from "@/model/Client";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { code, wabaId, phoneNumberId } = await req.json();

//     // const tokenCookie = (await cookies()).get("token");

//     // if (!tokenCookie) {
//     //   return NextResponse.json(
//     //     { error: "Unauthorized" },
//     //     { status: 401 }
//     //   );
//     // }

//     // const decoded = jwt.verify(
//     //   tokenCookie.value,
//     //   process.env.JWT_SECRET
//     // );

//     // const userId = decoded.userId;

//     const tokenResponse = await fetch(
//       "https://graph.facebook.com/v25.0/oauth/access_token",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           client_id: process.env.META_APP_ID,
//           client_secret: process.env.META_APP_SECRET,
//           code,
//         }),
//       }
//     );

//     const tokenData = await tokenResponse.json();

//     console.log(tokenData);

//     if (!tokenData.access_token) {
//       return NextResponse.json(
//         { error: "Unable to exchange token" },
//         { status: 400 }
//       );
//     }

//     // await Client.create({
//     //   userId,
//     //   clientId: phoneNumberId,
//     //   wabaId,
//     //   accessToken: tokenData.access_token,
//     //   isActive: true,
//     // });

//     return NextResponse.json({
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

// api/whatsapp/connect/route.js
// ─────────────────────────────────────────────────────────────────────────────
// This route receives the authorization code + WABA/Phone IDs from the frontend
// and performs a server-to-server call to Meta to exchange it for an access token.
//
// ENV vars required (add to .env.local):
//   META_APP_ID          = your Meta App ID
//   META_APP_SECRET      = your Meta App Secret  (Basic Settings → App Secret)
//   META_REDIRECT_URI    = the OAuth redirect URI registered in FB Login settings
//                          e.g. https://yourdomain.com/api/whatsapp/connect
//                          (must match exactly what's in your FB Login settings)
// ─────────────────────────────────────────────────────────────────────────────
// api/whatsapp/connect/route.js
// ENV vars required (.env.local):
//   META_APP_ID      = your Meta App ID
//   META_APP_SECRET  = your Meta App Secret (Settings → Basic → App Secret)
// META_REDIRECT_URI is no longer needed for FB.login() popup flows.



// app/api/whatsapp/connect/route.js
// Docs: https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-customers-as-a-tech-provider
//
// .env.local required:
//   META_APP_ID     = your App ID
//   META_APP_SECRET = your App Secret (Settings → Basic → App Secret)


import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Client from "@/model/Client";
import { cookies } from "next/headers"; // 👈 Add this
import axios from "axios";
export async function POST(req) {
  console.log("[Meta Onboarding] Handshake sequence initiated.");

  try {
    // 1. Extract payload from frontend axios.post
    const body = await req.json();
    const { code, redirectUri } = body;
    console.log("Into the body",body)

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing from payload" },
        { status: 400 }
      );
    }


     const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
    
      if (!token) {
        // No token? Kick them out to the login page immediately
        // redirect("/login");
        console.log("Nno token")

      }
      // Decode token to get the user's ID
      let userId;
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id; // adjust based on your token payload
      } catch {
        // redirect("/login");
      }


    // Connect to your database early to ensure it's alive
    await dbConnect();

    // 2. Exchange short-lived auth code for a system user/client access token
    // Meta requires application/x-www-form-urlencoded format for this endpoint
   // ... inside app/api/whatsapp/connect/route.js ...

    const tokenExchangeUrl = "https://graph.facebook.com/v25.0/oauth/access_token";
    
    // 🔥 THE FIX: 
    // 1. Remove redirect_uri completely.
    // 2. Add grant_type to enforce the exchange type.
    // const tokenParams = new URLSearchParams({
    //   client_id: process.env.NEXT_PUBLIC_META_APP_ID,
    //   client_secret: process.env.META_APP_SECRET,
    //   code: code,
    //   grant_type: "authorization_code"
    // });

    // const tokenResponse = await fetch(tokenExchangeUrl, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body: tokenParams,
    // });

    // const tokenData = await tokenResponse.json();
    // console.log("Got token data",tokenData)
    // ... inside app/api/whatsapp/connect/route.js

    // const tokenExchangeUrl = "https://graph.facebook.com/v25.0/oauth/access_token";
    
    // We can now safely pass the redirectUri because we know exactly what it is!
    const tokenParams = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_META_APP_ID,
      client_secret: process.env.META_APP_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri:redirectUri, 
    });

    const tokenResponse = await fetch(tokenExchangeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams,
    });
const tokenData = await tokenResponse.json();
console.log("Got token data",tokenData)
// ... the rest of your WABA and Phone ID extraction logic
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("[Meta OAuth Error]:", tokenData.error || tokenData);
      return NextResponse.json(
        { error: tokenData.error?.message || "Failed to exchange authorization code." },
        { status: 400 }
      );
    }

    const clientAccessToken = tokenData.access_token;
    // Example: Fetch business accounts
    console.log("Fetching req")
const accountsRes = await fetch("https://graph.facebook.com/v25.0/me/accounts?access_token="+clientAccessToken);
const accountsData = await accountsRes.json();
console.log(accountsData)

 const wabaId=2219154028858065;
try {
    const response = await axios.post(
      `https://graph.facebook.com/v25.0/${wabaId}/subscribed_apps`,
      {}, // The body must be empty
      {
        headers: {
          Authorization: `Bearer ${clientAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WABA successfully subscribed to Webhook!", response.data);
  } catch (error) {
    console.error("❌ Subscription failed:", error.response?.data || error.message);
  }

// Locate the WABA ID in the response array
// const waba = accountsData.data.find(acc => acc.business_management_asset_type === 'WHATSAPP_BUSINESS_ACCOUNT');
// const wabaId = waba?.id;
// console.log

    // // 3. Extract the WABA ID and Phone Number ID
    // // Embedded Onboarding v4 wraps this inside the whatsapp_business_api_data object
    // const apiData = tokenData.whatsapp_business_api_data;
    // const wabaId = tokenData.waba_id || apiData?.waba_id;
    // const phoneId = tokenData.phone_number_id || apiData?.phone_number_id;

    // if (!wabaId || !phoneId) {
    //   console.error("[Meta Onboarding Error]: Missing IDs in response metadata.", tokenData);
    //   return NextResponse.json(
    //     { error: "Failed to parse WABA ID or Phone ID from Meta payload." },
    //     { status: 422 }
    //   );
    // }

    // console.log(`[Meta Onboarding] Verified IDs -> WABA: ${wabaId} | Phone: ${phoneId}`);

    // 4. Register the phone number (wakes up the client's API connection)
    // try {
    //   const registerRes = await fetch(`https://graph.facebook.com/v25.0/${phoneId}/register`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${clientAccessToken}`,
    //     },
    //     body: JSON.stringify({
    //       messaging_product: "whatsapp",
    //       pin: "123456", // Default registration pin for client systems
    //     }),
    //   });
      
    //   if (!registerRes.ok) {
    //     const regError = await registerRes.json();
    //     console.warn("[Registration Note]: Number registration skipped/already active.", regError);
    //   }
    // } catch (regError) {
    //   console.warn("[Registration Non-Blocking Failure]:", regError.message);
    // }

    // // 5. Subscribe your Meta App to the client's WABA webhooks automatically
    // try {
    //   const subRes = await fetch(`https://graph.facebook.com/v25.0/${wabaId}/subscribed_apps`, {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${clientAccessToken}`,
    //     },
    //   });

    //   if (!subRes.ok) {
    //     const subError = await subRes.json();
    //     console.warn("[Webhook Subscription Note]: Already subscribed or requires manual verification.", subError);
    //   }
    // } catch (subError) {
    //   console.warn("[Subscription Non-Blocking Failure]:", subError.message);
    // }

    // 6. Persistence: Commit configuration data safely to MongoDB
    // // Adjust fields based on your exact Client model schema definitions
   
    const phoneId=1115204521681767;
   const savedClient = await Client.findOneAndUpdate(
      { clientId: phoneId }, // Search trigger: Look for this Meta Phone ID
      {
        userId: userId, 
        name: "Vivek",
        whatsappNumber: wabaId,
        accessToken: clientAccessToken,
        active: true, // Reactivate them if they were previously disabled
      },
      { 
        new: true,    // Returns the newly updated document instead of the old one
        upsert: true, // 🔥 Creates a new document if one doesn't exist
        runValidators: true // Enforces your schema rules (like required fields)
      }
    );
    console.log("[Meta Onboarding] Handshake complete. Database synchronized.");
    return NextResponse.json({ success: true}, { status: 200 });

  } catch (error) {
    console.error("[Fatal Onboarding Router Error]:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during handshake validation." },
      { status: 500 }
    );
  }
}

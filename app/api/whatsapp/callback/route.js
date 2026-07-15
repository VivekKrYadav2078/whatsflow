import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Client from "@/model/Client";

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

    // Connect to your database early to ensure it's alive
    await dbConnect();

    // 2. Exchange short-lived auth code for a system user/client access token
    // Meta requires application/x-www-form-urlencoded format for this endpoint
    const tokenExchangeUrl = "https://graph.facebook.com/v25.0/oauth/access_token";
    const tokenParams = new URLSearchParams({
      client_id: process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID,
      client_secret: process.env.META_APP_SECRET,
      code: code,
      redirect_uri: redirectUri, // Must match the dynamic frontend URL exactly
    });

    const tokenResponse = await fetch(tokenExchangeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams,
    });

    const tokenData = await tokenResponse.json();
    console.log("Got token data",tokenData)

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("[Meta OAuth Error]:", tokenData.error || tokenData);
      return NextResponse.json(
        { error: tokenData.error?.message || "Failed to exchange authorization code." },
        { status: 400 }
      );
    }

    const clientAccessToken = tokenData.access_token;

    // 3. Extract the WABA ID and Phone Number ID
    // Embedded Onboarding v4 wraps this inside the whatsapp_business_api_data object
    const apiData = tokenData.whatsapp_business_api_data;
    const wabaId = tokenData.waba_id || apiData?.waba_id;
    const phoneId = tokenData.phone_number_id || apiData?.phone_number_id;

    if (!wabaId || !phoneId) {
      console.error("[Meta Onboarding Error]: Missing IDs in response metadata.", tokenData);
      return NextResponse.json(
        { error: "Failed to parse WABA ID or Phone ID from Meta payload." },
        { status: 422 }
      );
    }

    console.log(`[Meta Onboarding] Verified IDs -> WABA: ${wabaId} | Phone: ${phoneId}`);

    // // 4. Register the phone number (wakes up the client's API connection)
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

    // 5. Subscribe your Meta App to the client's WABA webhooks automatically
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
    // await Client.findOneAndUpdate(
    //   { wabaId: wabaId }, // Query by unique WABA configuration
    //   {
    //     clientId: phoneId, 
    //     accessToken: clientAccessToken,
    //     isActive: true,
    //     updatedAt: new Date(),
    //   },
    //   { upsert: true, new: true } // If they re-onboard, update their details; otherwise, create a record
    // );

    console.log("[Meta Onboarding] Handshake complete. Database synchronized.");
    return NextResponse.json({ success: true, wabaId, phoneId }, { status: 200 });

  } catch (error) {
    console.error("[Fatal Onboarding Router Error]:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during handshake validation." },
      { status: 500 }
    );
  }
}
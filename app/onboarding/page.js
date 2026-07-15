"use client";
import React, { useState, useEffect } from "react";
import { Smartphone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function WhatsAppV4Onboarding() {
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const router = useRouter();

    const metaAppId = process.env.NEXT_PUBLIC_META_APP_ID;
    const metaConfigId = process.env.NEXT_PUBLIC_META_CONFIG_ID;

    // Detect if the user just returned from Facebook with a success code
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            setLoading(true);
            
            const exchangeCode = async () => {
                try {
                    // The exact URL we told Facebook to return us to
                    const currentUrl = window.location.origin + window.location.pathname;

                    const res = await axios.post("/api/whatsapp/connect", { 
                        code: code,
                        redirectUri: currentUrl 
                    });
                    
                    if (res.status === 200) {
                        setIsConnected(true);
                        // Clean the URL bar so it doesn't re-trigger on refresh
                        window.history.replaceState({}, document.title, window.location.pathname);
                        setTimeout(() => {
                            router.push("/dashboard");
                        }, 2000);
                    }
                } catch (err) {
                    console.error("Exchange error:", err);
                    alert("Backend handshake failed during key exchange.");
                } finally {
                    setLoading(false);
                }
            };

            exchangeCode();
        }
    }, [router]);

    // Construct the OAuth URL manually and redirect
    const handleV4Signup = () => {
        if (!metaAppId || !metaConfigId) {
            return alert("Missing NEXT_PUBLIC_META_APP_ID or NEXT_PUBLIC_META_CONFIG_ID.");
        }

        setLoading(true);

        const currentUrl = window.location.origin + window.location.pathname;
        // The complete v4 signature payload
const extras = encodeURIComponent(JSON.stringify({ 
    featureType: "whatsapp_business_app_onboarding",
    sessionInfoVersion: 3, 
    version: "v4", 
    setup: {} 
}));
        
        // The silver bullet: A pure, manually constructed OAuth request
        // const oauthUrl = `https://www.facebook.com/v25.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${encodeURIComponent(currentUrl)}&response_type=code&config_id=${metaConfigId}&override_default_response_type=true&extras=${extras}`;
const oauthUrl = `https://www.facebook.com/v25.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${encodeURIComponent(currentUrl)}&response_type=code&config_id=${metaConfigId}&scope=business_management,whatsapp_business_management,whatsapp_business_messaging&extras=${extras}`;
        // Redirect the browser, bypassing the buggy SDK popup
        window.location.href = oauthUrl;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center font-sans">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl space-y-6">
                <header className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Smartphone size={24} />
                    </div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Embedded Onboarding v4</h1>
                </header>

                {isConnected ? (
                    <div className="bg-green-50 border border-green-100 p-5 rounded-2xl text-center space-y-2 animate-in zoom-in duration-300">
                        <CheckCircle2 className="text-green-600 mx-auto" size={28} />
                        <p className="text-xs font-black text-green-800 uppercase tracking-wider">Sync Connection Live</p>
                        <p className="text-[10px] text-green-600 px-2">Nedrix has registered your Cloud API configurations.</p>
                    </div>
                ) : (
                    <button
                        onClick={handleV4Signup}
                        disabled={loading}
                        className="w-full bg-[#1877F2] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#166FE5] transition-all disabled:bg-gray-100 disabled:text-gray-400 shadow-md"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : "Authorize with Facebook"}
                        <ArrowRight size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

// "use client";
// import React, { useEffect, useState } from "react";
// import { Smartphone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function WhatsAppSyncOnboarding() {
//   const [loading, setLoading] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const router = useRouter();

//   const metaAppId = process.env.NEXT_PUBLIC_META_APP_ID;
//   const metaConfigId = process.env.NEXT_PUBLIC_META_CONFIG_ID;

//   const syncPayload = React.useRef({
//     code: null,
//     wabaId: null,
//     phoneId: null,
//     hasFired: false
//   });

//   const evaluateSyncState = async () => {
//     const { code, wabaId, phoneId, hasFired } = syncPayload.current;

//     // 🚨 DEBUGGER LOG: See exactly what the gatekeeper is looking at
//     console.log(`[Sync Gate Check] Code: ${!!code} | WABA: ${wabaId || 'MISSING'} | Phone: ${phoneId || 'MISSING'} | Locked: ${hasFired}`);

//     // We removed 'phoneId' from the strict requirement just in case they skipped the phone step!
//     if (code && wabaId && !hasFired) {
//       syncPayload.current.hasFired = true; 
      
//       try {
//         console.log("🟢 [Sync Passed] Executing server handshake...");
//         const res = await axios.post("/api/whatsapp/connect", {
//           code,
//           wabaId,
//           phoneId, // Could be null, backend should handle gracefully
//         });

//         if (res.status === 200) {
//           setIsConnected(true);
//           setTimeout(() => router.push("/dashboard"), 2000);
//         }
//       } catch (err) {
//         console.error("🔴 [Backend Handshake Failed]:", err.response?.data || err.message);
//         alert(err.response?.data?.error || "Handshake validation failed.");
//         syncPayload.current.hasFired = false; 
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     window.fbAsyncInit = function () {
//       window.FB.init({
//         appId: metaAppId,
//         cookie: true,
//         xfbml: true,
//         version: "v25.0",
//       });
//     };

//     (function (d, s, id) {
//       var js, fjs = d.getElementsByTagName(s)[0];
//       if (d.getElementById(id)) return;
//       js = d.createElement(s); js.id = id;
//       js.src = "https://connect.facebook.net/en_US/sdk.js";
//       fjs.parentNode.insertBefore(js, fjs);
//     }(document, "script", "facebook-jssdk"));

//     const handleMetaMessage = (event) => {
//       // 🚨 DEBUGGER LOG: Catches ALL window messages. See if Meta is actually talking!
//       console.log(`[Raw Frame Message] Origin: ${event.origin}`, event.data);

//       if (!event.origin.includes("facebook.com")) return;

//       try {
//         const payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
//         if (payload.type === "WA_EMBEDDED_SIGNUP") {
//           console.log("🔥 [TRUCK 1 ARRIVED] Meta Event Type:", payload.event);

//           if (payload.event === "FINISH" || payload.event.startsWith("FINISH_")) {
//             // Check arrays for waba_ids just in case Meta passes it as a list
//             syncPayload.current.wabaId = payload.data?.waba_id || payload.data?.waba_ids?.[0];
//             syncPayload.current.phoneId = payload.data?.phone_number_id;
            
//             console.log("🎯 [IDs Extracted] -> WABA:", syncPayload.current.wabaId, "| Phone:", syncPayload.current.phoneId);
//             evaluateSyncState();
//           } else if (payload.event === "CANCEL") {
//             setLoading(false);
//             console.warn("⚠️ [User Abandoned Popup] Stopped at step:", payload.data?.current_step);
//           } else if (payload.event === "ERROR") {
//             setLoading(false);
//             console.error("❌ [Meta Flow Error]:", payload.data);
//           }
//         }
//       } catch (err) {
//         // Ignore internal Facebook React synthetic events
//       }
//     };

//     window.addEventListener("message", handleMetaMessage);
//     return () => window.removeEventListener("message", handleMetaMessage);
//   }, [metaAppId]);

//   const fbLoginCallback = (response) => {
//     console.log("📘 [Raw FB Login Response]:", response);
    
//     if (response.authResponse) {
//       syncPayload.current.code = response.authResponse.code;
//       console.log("🔥 [TRUCK 2 ARRIVED] Auth Code Captured");
//       evaluateSyncState();
//     } else {
//       setLoading(false);
//       console.error("❌ [Meta SDK] Authentication rejected.");
//     }
//   };

//   const launchWhatsAppSignup = () => {
//     if (!window.FB) return alert("SDK loading...");

//     setLoading(true);
//     syncPayload.current = { code: null, wabaId: null, phoneId: null, hasFired: false };
//     console.log("🚀 [Flow Started] Awaiting events...");

//     window.FB.login(fbLoginCallback, {
//       config_id: metaConfigId,
//       response_type: "code",
//       override_default_response_type: true,
//       extras: {
//         featureType: "whatsapp_business_app_onboarding",
//         sessionInfoVersion: 3,
//         version: "v4",
//         setup: {},
//       },
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center font-sans">
//       <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl space-y-6">
//         <header className="text-center space-y-2">
//           <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
//             <Smartphone size={24} />
//           </div>
//           <h1 className="text-xl font-black text-gray-900 tracking-tight">Embedded Onboarding v4</h1>
//         </header>

//         {isConnected ? (
//           <div className="bg-green-50 border border-green-100 p-5 rounded-2xl text-center space-y-2 animate-in zoom-in duration-300">
//             <CheckCircle2 className="text-green-600 mx-auto" size={28} />
//             <p className="text-xs font-black text-green-800 uppercase tracking-wider">Sync Connection Live</p>
//           </div>
//         ) : (
//           <button
//             onClick={launchWhatsAppSignup}
//             disabled={loading}
//             className="w-full bg-[#1877F2] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#166FE5] transition-all disabled:bg-gray-100 disabled:text-gray-400 shadow-md"
//           >
//             {loading ? <Loader2 size={14} className="animate-spin" /> : "Authorize with Facebook"}
//             <ArrowRight size={14} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
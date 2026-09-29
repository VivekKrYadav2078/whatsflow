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

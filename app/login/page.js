"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/dashboard"); // Take me to the rules!
    } else {
      alert("Invalid Admin Credentials");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-3 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-green-600 fill-green-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">Nedrix Admin</h1>
          <p className="text-slate-400 text-sm">Secure Access for ReplyChat</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Admin Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold">
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
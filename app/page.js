import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Rocket } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Zap className="text-green-600 fill-green-600" />
          <span className="text-xl font-black tracking-tighter">WhatsFlow</span>
        </div>
        <Link href="/api/auth/google/login">
          <Button variant="outline" className="rounded-full px-8"> Login</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-20 px-4 text-center">
        <h1 className="text-6xl font-black text-slate-900 max-w-4xl leading-tight">
          Automate your WhatsApp <br /> 
          <span className="text-green-600">Like a Professional.</span>
        </h1>
        <p className="mt-6 text-slate-500 text-lg max-w-2xl">
          Scale your business with WhatsFlow. Build rules, manage clients, and 
          never miss a lead again.
        </p>
        <Link href="/api/auth/google/login" className="mt-10">
          <Button className="bg-green-600 hover:bg-green-700 h-14 px-10 text-lg rounded-full shadow-lg shadow-green-200 font-bold">
             Login
          </Button>
        </Link>
      </section>
    </div>
  );
}
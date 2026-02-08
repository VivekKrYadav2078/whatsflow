import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

  // 🟢 This expires the cookie immediately
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set date to the past
    path: "/",
  });

  return response;
}
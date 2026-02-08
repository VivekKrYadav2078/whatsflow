import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // Set this in your .env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Set this in your .env
const JWT_SECRET = process.env.JWT_SECRET; // A random long string in your .env

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. Simple Admin Check (Hardcoded for now)
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid  credentials" }, { status: 401 });
    }

    // 2. Create the Token
    const token = jwt.sign(
      { role: "admin", user: "NedrixAdmin" },
      JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // 3. Send back the response with a Secure Cookie
    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true, // 🔒 Crucial: Prevents JavaScript from stealing the token
      secure:true,
      sameSite: "strict",
      maxAge: 86400, // 1 day in seconds
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
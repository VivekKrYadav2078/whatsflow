import {OAuth2Client} from "google-auth-library";
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server";
import  dbConnect from '@/lib/db'; // Our db connection

import User from "@/model/User";

const client =new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function GET(req){
    await dbConnect();

    const {searchParams}= new URL(req.url);
    const code=searchParams.get("code");

    if(!code){
        console.log("No code");
        return NextResponse.redirect("http://localhost:3000/login");
    }

    try{
        const tokenRes=await fetch("https://oauth2.googleapis.com/token",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                code,
                client_id:process.env.GOOGLE_CLIENT_ID,
                client_secret:process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri:process.env.GOOGLE_REDIRECT_URI,
                grant_type:"authorization_code",
            }),
        })

        const tokenData=await tokenRes.json();
        console.log("Token Data:",tokenData);
        if(!tokenData.id_token){
            return NextResponse.redirect("http://localhost:3000/login");
        }

        //Verify ID token

        const ticket=await client.verifyIdToken({
            idToken:tokenData.id_token,
            audience:process.env.GOOGLE_CLIENT_ID,
        });


        const payload=ticket.getPayload();
        const email=payload.email;
        const googleId=payload.sub;

        //find or create user

        let user=await User.findOne({email});

        if(!user){
            user=await User.create({
                email,
                googleId,
            });
        }else if(!user.googleId){
            user.googleId=googleId;
            user.save();
        }

        // Create jwt

        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        
        //Set cookie + redirect
        const response=NextResponse.redirect(
            "http://localhost:3000/dashboard"
        );

        response.cookies.set("token",token,{
            httpOnly:true,
            secure:false,
            path:"/",

        });
        return response;
    }catch(error){
        console.error("Google Auth Error:",error);
        return NextResponse.redirect("http://localhost:3000/login");
    }
    

}
import mongoose from "mongoose";
// import { unique } from "next/dist/build/utils";
// import { required } from "zod/v4/core/util.cjs";

const UserSchema= new mongoose.Schema({
    email:{ 
        type:String,
        required:true,
        unique:true
    },
    googleId:{
        type:String
    },
    password:{
        type:String
    },
    isSubscribed:{
        type:Boolean,
        default:false
    }

});
export default mongoose.models.User || mongoose.model("User",UserSchema);
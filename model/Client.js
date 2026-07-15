import mongoose from "mongoose";
import User from "./User";
const clientSchema = new mongoose.Schema(
  {
    // WhatsApp Cloud phone_number_id
    clientId: {
      type: String,
      required: true,
      unique: true
    },
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:User,               //Reference to User Model  User._id
      required:true,
      index:true
    },
    name:{
      type:String,
      required:true,
    },
    whatsappNumber:{
        type:String,
        required:true
    },

    // WhatsApp access token
    accessToken: {
      type: String,
      required: true
    },

    active: {
      type: Boolean,
      default: true
    },
    
  },
  { timestamps: true }
);

// Change your export line to this:
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

export default Client;

import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["MARKETING", "UTILITY", "AUTHENTICATION"],
      default: "MARKETING",
    },
    language: {
      type: String,
      default: "en_US",
    },
    // The visual/top part of the message
    header: {
      type: {
        type: String,
        enum: ["TEXT", "IMAGE", "VIDEO", "DOCUMENT", "NONE"],
        default: "NONE",
      },
      text: String, // If type is TEXT
      mediaUrl: String, // If type is IMAGE/VIDEO
    },
    // The main message content
    body: {
      type: String,
      required: [true, "Body text is required"],
    },
    // Text at the bottom in smaller font
    footer: {
      type: String,
      trim: true,
    },
    // Interactive elements
    buttons: [
      {
        type: {
          type: String,
          enum: ["QUICK_REPLY", "URL", "PHONE_NUMBER"],
          required: true,
        },
        text: { type: String, required: true },
        url: String,          // For URL buttons
        phoneNumber: String,  // For PHONE_NUMBER buttons
        buttonId: String,     // Custom ID for tracking clicks in your worker
      },
    ],
    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "APPROVED", "REJECTED"],
      default: "DRAFT",
    },
    metaTemplateName: {
      type: String, // The actual name registered in Meta Business Suite
    },
  },
  { timestamps: true }
);

// Index for faster searching by name within a client's account
TemplateSchema.index({ clientId: 1, name: 1 });

export default mongoose.models.Template || mongoose.model("Template", TemplateSchema);
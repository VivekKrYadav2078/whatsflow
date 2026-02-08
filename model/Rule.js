import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    index: true // Faster lookup for webhook
  },
  ruleName: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // TRIGGER SECTION
  triggerType: {
    type: String,
    enum: ["keyword", "button_click", "welcome", "fallback"],
    default: "keyword"
  },
  keywords: {
    type: [String], // Array of keywords for 'keyword' trigger
    default: []
  },
  buttonId: {
    type: String, // Exact match for 'button_click' trigger
    default: ""
  },
  priority: {
    type: Number,
    default: 1
  },

  // ACTION SECTION (The "Checklist")
  actions: {
    type: [String], // Stores ["shopify_lookup", "log_to_sheet", etc.]
    default: []
  },
  actionConfig: {
    sheetId: { type: String, default: "" },
    sheetName: { type: String, default: "Sheet1" }
  },

  // RESPONSE SECTION
  responseType: {
    type: String,
    enum: ["text", "buttons", "menu", "none"],
    default: "text"
  },
  responseText: {
    type: String,
    default: ""
  },
  
  // Data for Interactive Buttons
  buttons: [{
    title: String,
    id: String
  }],
  mediaPublicId:{type:String},
  mediaUrl:{type:String},
  mediaType:{
    type: String,
    enum: ["none", "image", "pdf"],
    default: "none"
  },

  // Data for Menu/List
  menuTitle: { type: String, default: "Select an Option" },
  menuItems: [{
    title: String,
    id: String
  }],
  active:{
    type:Boolean,
    default:true
  }

}, { timestamps: true });

// Index for fast matching during incoming messages
ruleSchema.index({ clientId: 1, triggerType: 1 });

const Rule = mongoose.models.Rule || mongoose.model("Rule", ruleSchema);
export default Rule;
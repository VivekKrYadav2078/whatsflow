export function processIncomingMessage(body) {
  // 1. Basic Validation
  if (body.object !== 'whatsapp_business_account') {
    console.log('Not a WhatsApp business account webhook');
    return null;
  }

  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const message = value?.messages?.[0];
  const contact = value?.contacts?.[0];

  // If there's no actual message array, it might be a status update (delivered/read)
  // We ignore those for our rules engine.
  if (!message) return null;

  // 2. Extract Data Based on Type
  let type = message.type;
  let textContent = "";

  if (type === "text") {
    textContent = message.text?.body;
  } else if (type === "button") {
    textContent = message.button?.text ||  message.button?.payload;
  } else if (type === "interactive") {
    const interactive = message.interactive;
    // Handles both Button Replies and List Selection
    textContent = interactive.button_reply?.id || interactive.list_reply?.id;
  } else{
    return null;
  }

  // 3. Return a "Clean" Object for QStash
  return {
    from: message.from,                // User's phone number
    name: contact?.profile?.name || "Unknown", 
    messageId: message.id,
    type: type,                        // text, button, interactive, etc.
    text: textContent,                 // The actual string to match against rules
    metadata: {
      clientId: value.metadata?.phone_number_id,
      waba_id: value.metadata?.display_phone_number,
      timestamp: message.timestamp
    }
  };
}
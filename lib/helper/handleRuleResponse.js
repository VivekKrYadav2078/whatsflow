import { sendWhatsAppMessage } from "@/utils/whatsappSender";

export async function handleRuleResponse(rule, userPhone, clientId,access_token) {
    try {
        
   
  const { responseType, responseText, buttons, menuItems, menuTitle, mediaUrl } = rule;

  // We structure the 'payload' based on the Rule's responseType
  let payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: userPhone,
  };

  switch (responseType) {
    case "text":
      payload.type = "text";
      payload.text = { body: responseText };
      break;

    case "buttons":
      // WhatsApp allows max 3 buttons
      payload.type = "interactive";
      payload.interactive = {
        type: "button",
        body: { text: responseText },
        action: {
          buttons: buttons.slice(0, 3).map((btn) => ({
            type: "reply",
            reply: { 
                id: btn.id,
                 title: btn.title.trim().substring(0, 20)  //limit 20
                },
          })),
        },
      };
      break; 

    case "menu":
      // WhatsApp 'List' menu allows max 10 items
      payload.type = "interactive";
      payload.interactive = {
        type: "list",
        header: { type: "text", text: menuTitle || "Select Option" },
        body: { text: responseText },
        action: {
          button: "View Options", // The text on the button that opens the list
          sections: [
            {
              title: "Choices",
              rows: menuItems.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description || "",
              })),
            },
          ],
        },
      };
      break;

    case "media":
      // For images/PDFs
      payload.type = "image"; // or 'document' based on your mediaType field
      payload.image = { link: mediaUrl, caption: responseText };
      break;

    default:
      console.log("No valid response type found for rule");
      return;
  }

  // Finally, call the utility that hits the Meta API
  return await sendWhatsAppMessage(clientId, payload,access_token);


   } catch (error) {
    throw error;
        
    }
}
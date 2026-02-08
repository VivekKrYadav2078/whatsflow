export default function validateRule(ruleData, hasFile) {
  // 1. Mandatory Core Fields
  if (!ruleData.ruleName?.trim() || !ruleData.responseText?.trim()) {
    return "Rule Name and Response Text are required";
  }

  // 2. Buttons Validation
  if (ruleData.responseType === "buttons") {
    if (!ruleData.buttons || ruleData.buttons.length === 0) return "At least one button is required";
    if (ruleData.buttons.length > 3) return "WhatsApp allows max 3 buttons";
    if (ruleData.buttons.some(btn => !btn.title?.trim() || !btn.id?.trim())) {
      return "All buttons need a Label and an Action ID";
    }
  }

  // 3. Menu Validation
  if (ruleData.responseType === "menu") {
    if (!ruleData.menuItems || ruleData.menuItems.length === 0) return "At least one menu item is required";
    if (ruleData.menuItems.length > 10) return "WhatsApp allows max 10 menu items";
    if (ruleData.menuItems.some(item => !item.title?.trim() || !item.id?.trim())) {
      return "All menu items need a Label and an Action ID";
    }
  }

  // 4. Media Validation
  if (ruleData.mediaType !== "none" && !hasFile && !ruleData.mediaUrl) {
    return "Media header selected but no file uploaded";
  }

  return null; // No errors!
}
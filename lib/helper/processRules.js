import Rule from "@/model/Rule";
import dbConnect from "../db";
import { handleRuleResponse } from "./handleRuleResponse";

export async function processRules(clientId, text, type, userPhone,access_token) {

    try {
        await dbConnect();

        let rules = null;
        let matchedRule = null;
        const cleanText = text.toLowerCase().trim();
        const sanitizedText = cleanText.replace(/[^\w\s]/g, "") || "";

        console.log("Sanitized text",JSON.stringify(sanitizedText));

        // 🟢 1. SMART SEARCH
        if (type === "button" || type === "interactive") {
            // Match by Button ID (Exact match is safer for buttons)
            console.log("The incoming is type button ",cleanText )
            matchedRule = await Rule.findOne({
                clientId,
                active: true,
                triggerType: "button_click",
                buttonId:  cleanText
                 // For buttons, 'text' is the ID we sent earlier
            });

        } else if(type==="text"){
            // Match by Keyword (Using MongoDB's $in operator is faster than a loop)
            console.log("The incoming is type text,keyword ",sanitizedText )
            rules = await Rule.find({
                clientId,
                active: true,
                triggerType: "keyword",
                // keywords: {
                //     $regex: sanitizedText,
                //     $options: "i"
                // }
            });
        }
//  console.log("Rules are",rules);
        if(rules && type!=="button" && type!=="interactive"){
            matchedRule=rules.find(rule=>
                rule.keywords.some(keyword=> sanitizedText.includes(keyword))
            )
        }
        // If no exact keyword match, try a partial match (Optional)
       //  PARTIAL FALLBACK (If the user wrote a long sentence)
        // if (!matchedRule && sanitizedText.length > 2) {
        //     matchedRule = await Rule.findOne({
        //         clientId,
        //         active: true,
        //         keywords: { $regex: sanitizedText, $options: "i" }
        //     });
        // }

        //   GLOBAL FALLBACK (The 'I don't understand' message)
        
        if (!matchedRule) {
            console.log("No match found ",matchedRule )
            matchedRule = await Rule.findOne({ clientId, triggerType: "fallback", active: true });
        }

        if (!matchedRule) return; // Exit if nothing matches

        //  EXECUTE RESPONSE
       console.log("Sending to handle rule  ",matchedRule )
        await handleRuleResponse(matchedRule, userPhone, clientId,access_token);
        return true;




    } catch (error) {
        console.error("Worker Processing Error:", error);
        throw error; // QStash needs this throw to trigger a retry

    }


}
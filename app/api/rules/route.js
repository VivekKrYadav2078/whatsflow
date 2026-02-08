import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Rule from "@/model/Rule";
import { v2 as cloudinary } from 'cloudinary';
import validateRule from "@/lib/ruleValidator";
// Configure Cloudinary

console.log("Cloudinary Config Check:", {
  name: process.env.CLOUDINARY_CLOUD_NAME ? "EXISTS" : "MISSING",
  key: process.env.CLOUDINARY_API_KEY ? "EXISTS" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "EXISTS" : "MISSING",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  console.log("Rule server hit")
  const clientId = searchParams.get("clientId");
  try {

    // 1. Get the logged-in user's ID from the session (JWT/NextAuth)
    // const session = await getServerSession(authOptions);

    // if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // 2. IMPORTANT: Don't just find rules by clientId. 
    // Find rules where clientId matches AND the client belongs to THIS user.
    await dbConnect();
    const rules = await Rule.find({
      clientId: clientId,
      // userId: session.user.id // This prevents "ID guessing" attacks
    });

    return NextResponse.json({ rules }, { status: 200 });


  } catch (error) {
    console.error(error);

  }
}

export async function POST(req) {
  try {

    const formData = await req.formData();
    let mediaUrl = "";
    let mediaPublicId = "";
    let mediaType = "none";
    const file = formData.get("file");
    const ruleData = JSON.parse(formData.get("ruleData"));

    // Validate data 
    const error = validateRule(ruleData, !!file);
    if (error) return NextResponse.json({ error }, { status: 400 });

    await dbConnect();


    // 1. Check if a file exists in the "suitcase"
    if (file && typeof file !== "string" && file.size > 0) {

      // Capture the mime-type (image/png, application/pdf, etc.)
      mediaType = file.type.startsWith("image/") ? "image" : "pdf";

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 2. Upload to Cloudinary using a Promise (The Senior way)
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "nedrix_automations", // Organizes  files in Cloudinary
            resource_type: "auto",  // Automatically detects Image vs PDF
            timeout: 60000
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Stream Error:", error);
              reject(error);
            }
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      // 3. Get the high-speed CDN URL
      mediaUrl = uploadResponse.secure_url;
      mediaPublicId = uploadResponse.public_id;
    }

    // 1. Separate the identity (query) from the content (update)
    // We search by clientId AND ruleName (or buttonId) to see if it exists
    const { _id, clientId, ruleName, ...updateData } = ruleData;

    if (!clientId || !ruleName) {
      return NextResponse.json({ error: "Missing identity fields" }, { status: 400 });
    }

    // 2. The Upsert Command
    const result = await Rule.findOneAndUpdate(
      { clientId, ruleName }, // Find a rule for THIS client with THIS name
      {
        $set: updateData,
        mediaUrl,
        mediaPublicId,
        mediaType
      },   // Update it with the new fields
      {
        new: true,            // Return the updated/new document
        upsert: true,         // <--- This is the magic: Create if not found
        runValidators: true   // Ensure schema rules are followed
      }
    );

    // // 3. Determine if it was a new creation or an update
    // // result.createdAt vs result.updatedAt can tell you this
    // const isNew = result.createdAt.getTime() === result.updatedAt.getTime();

    return NextResponse.json({
      message: "Rule created successfully",
      rule: result
    }, { status: 200 });

  } catch (error) {
    console.error("Upsert Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PUT(req) {
  try {

    const formData = await req.formData();
    const file = formData.get("file");
    const ruleData = JSON.parse(formData.get("ruleData"));

    //  Destructure: Pull media out so it doesn't stay in ...updateData
    const {
      _id,
      clientId,
      mediaUrl: incomingUrl,
      mediaPublicId: incomingPublicId,
      ...updateData
    } = ruleData

    if (!clientId || !_id) {
      return NextResponse.json({ error: "Missing identity fields" }, { status: 400 });
    }

    // Validate data 
    const error = validateRule(ruleData, !!file);
    if (error) return NextResponse.json({ error }, { status: 400 });

    await dbConnect();

    // 1. Fetch the EXISTING rule from DB to find the old image URL
    const existingRule = await Rule.findById(_id);
    if (!existingRule) return NextResponse.json({ error: "Rule not found" }, { status: 404 });


    // These variables hold the "Final Truth"
    let finalUrl = incomingUrl;
    let finalPublicId = incomingPublicId;
    let finalMediaType = existingRule?.mediaType || "none";

   const isNewFileUpload = file && typeof file !== "string" && file.size > 0;
   const isExplicitDelete = !incomingUrl && existingRule?.mediaUrl;


    let deleted = "";

    // 2. Check if a NEW file is being uploaded
    if (isNewFileUpload) {
      // --- CLEANUP LOGIC START ---
      if (existingRule?.mediaUrl) {

        deleted = await cloudinary.uploader.destroy(existingRule?.mediaPublicId, {
          resource_type: "image"
        });
        console.log("Old image deleted from Cloudinary:", mediaPublicId, "deletd s:", deleted);
      }
      // --- CLEANUP LOGIC END ---

      // 3. Upload the NEW file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "nedrix_automations", resource_type: "auto", timeout: 60000 },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      finalUrl = uploadResponse.secure_url;
      finalPublicId = uploadResponse.public_id;
      finalMediaType = file.type.startsWith("image/") ? "image" : "pdf";

    }
    // 4. CASE: Explicit Delete (User cleared the image in the Modal)
    else if (isExplicitDelete) {
      if (existingRule?.mediaPublicId) {
        await cloudinary.uploader.destroy(existingRule.mediaPublicId, {
          resource_type: existingRule.mediaType === "image" ? "image" : "raw"
        })
      }
      finalUrl = "";
      finalPublicId = "";
      finalMediaType = "none";
    }


    // 2. The Upsert Command
    // We find by _id AND clientId (for security)
    const result = await Rule.findOneAndUpdate(
      { clientId, _id }, // Find a rule for THIS client with THIS name
      {
        $set: updateData,
        mediaUrl: finalUrl,   // The correct URL (Old, New, or Empty)
        mediaPublicId: finalPublicId
      },   // Update it with the new fields
      {
        new: true,            // Return the updated/new document
        runValidators: true   // Ensure schema rules are followed
      }
    );


    if (!result) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Rule updated successfully", rule: result }, { status: 200 });

  } catch (error) {
    console.error("Upsert Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {

    // 1. Get data from URL params instead of formData
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clientId = searchParams.get("clientId");


    if (!id || !clientId) {
      return NextResponse.json({ error: "Missing ID or ClientID" }, { status: 400 });
    }
    await dbConnect();

    // 2. Find the rule (Security: ensure it belongs to the right clientId)
    const rule = await Rule.findOne({ _id: id, clientId: clientId });


    //Now check if rule is their or not
    if (!rule) {
      return NextResponse.json({ message: "Rule Not Found" }, { status: 404 });
    }

    let deleted = "";

    if (rule?.mediaPublicId) {
      try {
        deleted = await cloudinary.uploader.destroy(rule?.mediaPublicId, {
          resource_type: mediaType === "image" ? "image" : "raw"
        });
        console.log("Deleted", deleted);

      } catch (cloudErr) {
        console.error("Cloudinary Cleanup failed, continuing with DB delete:", cloudErr);

      }
    }

    const ruleDeleted = await rule.deleteOne();
    console.log("rule deleted:", ruleDeleted);
    return NextResponse.json({ message: "Rule and media deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });

  }

}
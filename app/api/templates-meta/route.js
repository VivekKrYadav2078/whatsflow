export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  
  await dbConnect();
  const templates = await Rule.find({ 
    clientId, 
    triggerType: "broadcast_template" 
  });
  return Response.json(templates);
}
import { connectDB } from "../../lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const collections = await db.listCollections().toArray();
    return new Response(
      JSON.stringify({
        success: true,
        collections: collections.map((c) => c.name),
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

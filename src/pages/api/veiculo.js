export const prerender = false;
import { connectDB } from "../../lib/db";
import { ObjectId } from "mongodb";

export async function POST({ request }) {
  try {
    const db = await connectDB();
    const body = await request.json();
    if (!body.placa)
      return new Response(JSON.stringify({ error: "Placa é obrigatória" }), {
        status: 400,
      });

    await db
      .collection("veiculos")
      .insertOne({
        ...body,
        dataCriacao: new Date(),
        latitude: body.latitude || null,
        longitude: body.longitude || null,
      });
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PUT({ request }) {
  try {
    const db = await connectDB();
    const body = await request.json();
    if (!body._id)
      return new Response(JSON.stringify({ error: "ID necessário" }), {
        status: 400,
      });

    const { _id, ...dataToUpdate } = body;
    await db
      .collection("veiculos")
      .updateOne({ _id: new ObjectId(_id) }, { $set: dataToUpdate });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE({ request }) {
  try {
    const db = await connectDB();
    const body = await request.json();
    if (!body._id)
      return new Response(JSON.stringify({ error: "ID necessário" }), {
        status: 400,
      });

    await db.collection("veiculos").deleteOne({ _id: new ObjectId(body._id) });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    const veiculos = await db
      .collection("veiculos")
      .find({})
      .sort({ dataCriacao: -1 })
      .toArray();
    return new Response(JSON.stringify(veiculos), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

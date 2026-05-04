export const prerender = false;
import { connectDB } from "../../lib/db";
import { ObjectId } from "mongodb";

export async function POST({ request }) {
  try {
    const db = await connectDB();
    const body = await request.json();
    if (!body.nomeFantasia || !body.razaoSocial)
      return new Response(JSON.stringify({ error: "Dados obrigatórios" }), {
        status: 400,
      });

    const result = await db
      .collection("empresas")
      .insertOne({
        ...body,
        dataCriacao: new Date(),
        status: true,
        statusFinanceiro: true,
      });
    return new Response(
      JSON.stringify({ success: true, id: result.insertedId }),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
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
      .collection("empresas")
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

    await db.collection("empresas").deleteOne({ _id: new ObjectId(body._id) });
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
    const empresas = await db
      .collection("empresas")
      .find({})
      .sort({ dataCriacao: -1 })
      .toArray();
    return new Response(JSON.stringify(empresas), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

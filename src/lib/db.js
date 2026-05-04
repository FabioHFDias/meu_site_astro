// src/lib/db.js
import { MongoClient } from "mongodb";

// Tenta pegar de process.env (Node) ou import.meta.env (Vite/Astro)
const uri = process.env.MONGODB_URI || import.meta.env.MONGODB_URI;

if (!uri) {
  console.error("❌ ERRO: MONGODB_URI não encontrada no .env");
  console.error("📝 Verifique se o arquivo .env existe e contém:");
  console.error("MONGODB_URI=mongodb+srv://...");
  throw new Error("Defina MONGODB_URI no arquivo .env");
}

console.log("🔑 Tentando conectar ao MongoDB...");

const client = new MongoClient(uri);
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return client.db("rastreiafrota");
  }

  try {
    await client.connect();
    isConnected = true;
    console.log("✅ MongoDB conectado com sucesso!");
    console.log("📦 Banco:", client.db("rastreiafrota").databaseName);
    return client.db("rastreiafrota");
  } catch (error) {
    console.error("❌ Falha na conexão:", error.message);
    throw error;
  }
}

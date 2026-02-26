import { getDb } from "./server/db.ts";

async function createAdvertiser() {
  try {
    const db = await getDb();
    
    // Buscar o primeiro usuário
    const users = await db.query.users.findMany({ limit: 1 });
    
    if (users.length === 0) {
      console.log("Nenhum usuário encontrado");
      return;
    }
    
    const userId = users[0].id;
    console.log("Usuário ID:", userId);
    
    // Verificar se já existe um anunciante para este usuário
    const existingAdvertiser = await db.query.advertisers.findFirst({
      where: (advertisers, { eq }) => eq(advertisers.userId, userId),
    });
    
    if (existingAdvertiser) {
      console.log("Anunciante já existe:", existingAdvertiser);
      return;
    }
    
    // Criar um novo anunciante
    const result = await db.insert(advertisers).values({
      userId,
      companyName: "Teste Empresa",
      companyDocument: "12345678000190",
      contactEmail: "teste@empresa.com.br",
      contactPhone: "(11) 98765-4321",
      status: "approved",
    });
    
    console.log("Anunciante criado:", result);
  } catch (error) {
    console.error("Erro:", error);
  }
}

createAdvertiser();

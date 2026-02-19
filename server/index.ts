import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // ===== API ROUTES (ANTES da rota catch-all) =====
  
  // Rota para salvar leads
  app.post("/api/leads", async (req, res) => {
    try {
      const { name, email, phone, company, message } = req.body;

      // Validar campos obrigatorios
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Nome, email e mensagem sao obrigatorios" });
      }

      // Conectar ao banco de dados
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "kadeh",
      });

      // Inserir lead no banco de dados
      const query = "INSERT INTO leads (name, email, phone, company, message, source) VALUES (?, ?, ?, ?, ?, ?)";
      await connection.execute(query, [name, email, phone || null, company || null, message, "kadeh_ads"]);

      await connection.end();

      res.json({ success: true, message: "Lead salvo com sucesso" });
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      res.status(500).json({ error: "Erro ao salvar lead" });
    }
  });

  // ===== CLIENT-SIDE ROUTING (DEPOIS das rotas de API) =====
  
  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

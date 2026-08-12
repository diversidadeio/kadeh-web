// Ponto de entrada da API para o Vercel (Serverless Function)
// Esta função serve todas as rotas /api/* como uma Serverless Function Express
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import multer from "multer";
import { storagePut } from "../server/storage";
import { handleStripeWebhook } from "../server/stripeWebhook";

const app = express();

// Configurar body parser com limite maior para uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Proxy de storage
registerStorageProxy(app);

// Rotas OAuth
registerOAuthRoutes(app);

// Webhook do Stripe - DEVE ser antes do express.json() para verificação de assinatura
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Configurar multer para uploads de arquivos
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint de upload de arquivos
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const contentType = req.file.mimetype;

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileKey = `campaigns/${timestamp}-${random}-${fileName}`;

    const { url } = await storagePut(fileKey, fileBuffer, contentType);

    return res.json({ url, key: fileKey });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      error: "Upload failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;

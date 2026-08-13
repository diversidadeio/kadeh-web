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
import { createClient } from "@supabase/supabase-js";

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

// Rota de recuperacao de senha via Resend
app.post("/api/send-recovery-email", async (req, res) => {
  try {
    const { email, redirectTo } = req.body;
    if (!email) {
      return res.status(400).json({ error: "E-mail obrigatorio." });
    }

    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: redirectTo || "https://kadeh-web.tawny.vercel.app/redefinir-senha" },
    });

    if (linkError || !data?.properties?.action_link) {
      console.error("[Recovery] Erro ao gerar link:", linkError?.message);
      return res.status(500).json({ error: "Erro ao gerar link de recuperacao." });
    }

    const recoveryLink = data.properties.action_link;
    const emailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f4f4f4}.wrap{max-width:600px;margin:30px auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1)}.hd{background:#1a3a5c;color:#fff;padding:30px 20px;text-align:center}.body{background:#fff;padding:35px 30px}.btn{display:inline-block;background:#FF6B35;color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:700;margin:20px 0}.ft{background:#f0f0f0;padding:15px 20px;text-align:center;font-size:12px;color:#888}</style></head><body><div class="wrap"><div class="hd"><h2 style="margin:0">Recuperacao de Senha</h2></div><div class="body"><p>Ola,</p><p>Recebemos uma solicitacao para redefinir a senha da conta <strong>${email}</strong>.</p><p>Clique no botao abaixo para criar uma nova senha:</p><div style="text-align:center"><a href="${recoveryLink}" class="btn">Redefinir minha senha</a></div><p style="font-size:14px;color:#666">Este link expira em <strong>1 hora</strong>.</p><p style="font-size:14px;color:#666">Se voce nao solicitou isso, ignore este e-mail.</p><hr style="border:none;border-top:1px solid #eee;margin:25px 0"><p style="font-size:12px;color:#999">Link direto: ${recoveryLink}</p></div><div class="ft"><p>2026 Kadeh. E-mail automatico, nao responda.</p></div></div></body></html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Kadeh <nao-responder@kadeh.io>",
        to: [email],
        subject: "Recuperacao de Senha - Kadeh",
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      console.error("[Recovery] Erro Resend:", resendData);
      return res.status(500).json({ error: "Erro ao enviar e-mail." });
    }

    console.log("[Recovery] E-mail enviado para:", email, "ID:", resendData.id);
    return res.json({ success: true });
  } catch (err) {
    console.error("[Recovery] Erro interno:", err);
    return res.status(500).json({ error: "Erro interno do servidor." });
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

import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, redirectTo } = req.body || {};
    
    if (!email) {
      return res.status(400).json({ error: "E-mail obrigatorio." });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !serviceKey || !resendKey) {
      console.error("[Recovery] Variáveis de ambiente ausentes.");
      return res.status(500).json({ error: "Configuração do servidor incompleta." });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { data, error: linkError } = await (supabaseAdmin.auth.admin as any).generateLink({
      type: "recovery",
      email: email,
      options: { redirectTo: redirectTo || "https://kadeh-web.tawny.vercel.app/redefinir-senha" },
    });

    if (linkError) {
      console.error("[Recovery] Erro ao gerar link:", linkError.message);
      if (linkError.message.includes("User not found") || linkError.status === 404) {
        return res.status(404).json({ error: "Este e-mail não está cadastrado." });
      }
      return res.status(500).json({ error: "Erro ao gerar link de recuperacao." });
    }

    if (!data?.properties?.action_link) {
      return res.status(500).json({ error: "Erro ao gerar link de recuperacao." });
    }

    const recoveryLink = data.properties.action_link;

    const emailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f4f4f4}.wrap{max-width:600px;margin:30px auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1)}.hd{background:#fff;padding:30px 20px;text-align:center;border-bottom:1px solid #eee}.body{background:#fff;padding:35px 30px}.btn{display:inline-block;background:#FF6B35;color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:700;margin:20px 0}.ft{background:#f0f0f0;padding:15px 20px;text-align:center;font-size:12px;color:#888}</style></head><body><div class="wrap"><div class="hd"><img src="https://kadeh-web.tawny.vercel.app/images/logo-kadeh.png" alt="Kadeh" style="max-height:50px;margin-bottom:15px"><h2 style="margin:0;color:#1a3a5c">Recuperacao de Senha</h2></div><div class="body"><p>Ola,</p><p>Recebemos uma solicitacao para redefinir a senha da conta <strong>${email}</strong>.</p><p>Clique no botao abaixo para criar uma nova senha:</p><div style="text-align:center"><a href="${recoveryLink}" class="btn">Redefinir minha senha</a></div><p style="font-size:14px;color:#666">Este link expira em <strong>1 hora</strong>.</p><p style="font-size:14px;color:#666">Se voce nao solicitou isso, ignore este e-mail.</p><hr style="border:none;border-top:1px solid #eee;margin:25px 0"><p style="font-size:12px;color:#999">Link direto: ${recoveryLink}</p></div><div class="ft"><p>2026 Kadeh. E-mail automatico, nao responda.</p></div></div></body></html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendKey}`,
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
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("[Recovery] Erro interno:", err.message);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

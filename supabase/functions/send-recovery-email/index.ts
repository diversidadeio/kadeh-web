import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, redirectTo } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "E-mail obrigatorio." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cliente admin para gerar o link de recuperacao de senha
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: redirectTo ?? "https://kadeh-web.tawny.vercel.app/redefinir-senha",
      },
    });

    if (linkError) {
      console.error("Erro ao gerar link:", linkError.message);
      return new Response(JSON.stringify({ error: "Erro ao gerar link de recuperacao." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const recoveryLink = data?.properties?.action_link ?? "";

    if (!recoveryLink) {
      return new Response(JSON.stringify({ error: "Link de recuperacao nao gerado." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Template HTML do e-mail
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f4f4f4}
.wrap{max-width:600px;margin:30px auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1)}
.hd{background:#1a3a5c;color:#fff;padding:30px 20px;text-align:center}
.body{background:#fff;padding:35px 30px}
.btn{display:inline-block;background:#FF6B35;color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:700;margin:20px 0}
.ft{background:#f0f0f0;padding:15px 20px;text-align:center;font-size:12px;color:#888}
.lnk{word-break:break-all;font-size:12px;color:#666}
</style>
</head>
<body>
<div class="wrap">
<div class="hd"><h2 style="margin:0">Recuperacao de Senha - Kadeh</h2></div>
<div class="body">
<p>Ola,</p>
<p>Recebemos uma solicitacao para redefinir a senha da conta <strong>${email}</strong>.</p>
<p>Clique no botao abaixo para criar uma nova senha:</p>
<div style="text-align:center"><a href="${recoveryLink}" class="btn">Redefinir minha senha</a></div>
<p style="font-size:14px;color:#666">Este link expira em <strong>1 hora</strong>.</p>
<p style="font-size:14px;color:#666">Se voce nao solicitou isso, pode ignorar este e-mail.</p>
<hr style="border:none;border-top:1px solid #eee;margin:25px 0">
<p style="font-size:12px;color:#999">Se o botao nao funcionar, copie e cole este link no navegador:</p>
<p class="lnk">${recoveryLink}</p>
</div>
<div class="ft"><p>2026 Kadeh. Todos os direitos reservados.</p><p>E-mail automatico, nao responda.</p></div>
</div>
</body>
</html>`;

    // Enviar via Resend REST API
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY") ?? ""}`,
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
      console.error("Erro Resend:", JSON.stringify(resendData));
      return new Response(JSON.stringify({ error: "Erro ao enviar e-mail." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("E-mail enviado para:", email, "ID:", resendData.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Erro interno:", err);
    return new Response(JSON.stringify({ error: "Erro interno do servidor." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

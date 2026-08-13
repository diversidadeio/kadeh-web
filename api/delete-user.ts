import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token de autenticação ausente." });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !anonKey || !serviceKey || !resendKey) {
      console.error("[DeleteUser] Variáveis de ambiente ausentes.");
      return res.status(500).json({ error: "Configuração do servidor incompleta." });
    }

    // Cliente com a chave do usuário para verificar a identidade
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Confirmar quem é o usuário autenticado
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    // Cliente admin com service_role para deletar o usuário
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Encerrar TODAS as sessões do usuário
    const { error: signOutError } = await (supabaseAdmin.auth.admin as any).signOut(
      user.id,
      "global"
    );

    if (signOutError) {
      console.warn("Aviso ao encerrar sessões globais:", signOutError.message);
    }

    // Deletar o usuário permanentemente
    const { error: deleteError } = await (supabaseAdmin.auth.admin as any).deleteUser(user.id);

    if (deleteError) {
      console.error("[DeleteUser] Erro ao deletar:", deleteError.message);
      return res.status(500).json({ error: "Erro ao excluir conta." });
    }

    // Enviar email de confirmação usando a API do Resend
    if (user.email) {
      try {
        const emailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f4f4f4}.wrap{max-width:600px;margin:30px auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1)}.hd{background:#fff;padding:30px 20px;text-align:center;border-bottom:1px solid #eee}.body{background:#fff;padding:35px 30px}.highlight{color:#FF6B35;font-weight:bold}.ft{background:#f0f0f0;padding:15px 20px;text-align:center;font-size:12px;color:#888}</style></head><body><div class="wrap"><div class="hd"><img src="https://kadeh.io/images/logo-kadeh.png" alt="Kadeh" style="max-height:50px;margin-bottom:15px"><h2 style="margin:0;color:#1a3a5c">Exclusao de Cadastro Concluida</h2></div><div class="body"><p>Ola,</p><p>Confirmamos que a sua solicitacao de exclusao de cadastro e dados pessoais foi <span class="highlight">concluida com sucesso</span>.</p><p>Todas as suas informacoes, historicos e dados relacionados foram removidos permanentemente de nossos servidores, em total conformidade com a LGPD e as normas de protecao de dados.</p><p>Sentiremos a sua falta! Se desejar voltar a usar nossos servicos no futuro, voce podera criar uma nova conta a qualquer momento.</p><br><p>Atenciosamente,<br><strong>Equipe Kadeh</strong></p></div><div class="ft"><p>2026 Kadeh. E-mail automatico, nao responda.</p></div></div></body></html>`;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Kadeh <nao-responder@kadeh.io>",
            to: [user.email],
            subject: "Confirmacao de Exclusao de Conta - Kadeh",
            html: emailHtml,
          }),
        });
      } catch (emailError) {
        console.error("[DeleteUser] Erro ao enviar email:", emailError);
      }
    }

    return res.status(200).json({ success: true, message: "Conta excluída com sucesso." });
  } catch (err: any) {
    console.error("[DeleteUser] Erro interno:", err.message);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

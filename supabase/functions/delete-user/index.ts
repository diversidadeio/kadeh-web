import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Lidar com preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verificar o token de autorização do usuário autenticado
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Token de autenticação ausente." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cliente com a chave do usuário para verificar a identidade
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Confirmar quem é o usuário autenticado
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Usuário não autenticado." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cliente admin com service_role para deletar o usuário
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Encerrar TODAS as sessões do usuário em todos os dispositivos e apps
    const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(
      user.id,
      "global"
    );

    if (signOutError) {
      // Continua mesmo com erro no signOut, pois a deleção já invalida as sessões
      console.warn("Aviso ao encerrar sessões globais:", signOutError.message);
    }

    // Deletar o usuário e todos os seus dados permanentemente
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Enviar email de confirmação usando a API do Resend
    if (user.email) {
      try {
        const emailHtml = `
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #1a3a5c; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .logo { max-height: 50px; margin-bottom: 15px; }
                .content { background-color: #f9f9f9; padding: 30px 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
                .highlight { color: #FF6B35; font-weight: bold; }
                .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <!-- Logo da Kadeh (URL baseada no domínio) -->
                  <img src="https://kadeh.io/images/logo.png" alt="Kadeh" class="logo" />
                  <h2 style="margin: 0;">Exclusão de Cadastro Concluída</h2>
                </div>
                <div class="content">
                  <p>Olá,</p>
                  <p>Confirmamos que a sua solicitação de exclusão de cadastro e dados pessoais foi <span class="highlight">concluída com sucesso</span>.</p>
                  <p>Todas as suas informações, históricos e dados relacionados foram removidos permanentemente de nossos servidores, em total conformidade com a LGPD e as normas de proteção de dados.</p>
                  <p>Sentiremos a sua falta! Se desejar voltar a usar nossos serviços no futuro, você poderá criar uma nova conta a qualquer momento.</p>
                  <br>
                  <p>Atenciosamente,<br><strong>Equipe Kadeh</strong></p>
                </div>
                <div class="footer">
                  <p>Este é um e-mail automático, por favor, não responda.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY") ?? ""}`
          },
          body: JSON.stringify({
            from: "Kadeh <nao-responder@kadeh.io>",
            to: [user.email],
            subject: "Confirmação de Exclusão de Conta",
            html: emailHtml
          })
        });
      } catch (emailError) {
        console.error("Erro ao enviar email de confirmação de exclusão:", emailError);
      }
    }

    return new Response(JSON.stringify({ success: true, message: "Conta e dados excluídos com sucesso." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erro interno do servidor." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

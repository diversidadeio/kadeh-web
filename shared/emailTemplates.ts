/**
 * Email templates for Kadeh Ads notifications
 */

export const PRICING_UPDATE_EMAIL = {
  subject: "🎉 Kadeh Ads - Nova Estrutura de Preços e Opção de Recorrência",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .pricing-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .pricing-table th, .pricing-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .pricing-table th { background: #667eea; color: white; }
        .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; border-radius: 4px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 15px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://kadeh.io/images/logo-kadeh.png" alt="Kadeh" style="max-height: 50px;">
        </div>
        <div class="header">
          <h1>🎉 Kadeh Ads - Atualização de Preços</h1>
        </div>

        <div class="content">
          <p>Olá,</p>
          
          <p>Temos o prazer de informar que atualizamos nossa estrutura de preços do <strong>Kadeh Ads</strong> para oferecer melhor valor e mais flexibilidade!</p>

          <h2>📊 Principais Mudanças:</h2>
          
          <h3>1. Novos Preços (4x Maior Alcance)</h3>
          <p>Todos os preços foram atualizados para refletir o maior alcance e impacto das campanhas:</p>
          
          <table class="pricing-table">
            <tr>
              <th>Duração</th>
              <th>Preço Anterior</th>
              <th>Novo Preço</th>
            </tr>
            <tr>
              <td>1 dia</td>
              <td>R$ 1.000</td>
              <td>R$ 4.000</td>
            </tr>
            <tr>
              <td>3 dias</td>
              <td>R$ 2.700</td>
              <td>R$ 10.800</td>
            </tr>
            <tr>
              <td>5 dias</td>
              <td>R$ 4.000</td>
              <td>R$ 16.000</td>
            </tr>
            <tr>
              <td>7 dias</td>
              <td>R$ 4.900</td>
              <td>R$ 19.600</td>
            </tr>
          </table>

          <h3>2. 🎁 Nova Opção de Recorrência com 50% de Desconto</h3>
          <p>Agora você pode contratar <strong>3 pacotes com 50% de desconto</strong>!</p>
          
          <div class="highlight">
            <strong>Exemplo:</strong><br>
            Campanha de 1 dia com 1 produto:<br>
            • Preço normal: R$ 4.400<br>
            • Com recorrência (3 pacotes): R$ 6.600 (50% OFF)
          </div>

          <h3>3. 💰 Benefícios da Recorrência:</h3>
          <ul>
            <li>✓ Economize 50% em campanhas contínuas</li>
            <li>✓ Mantenha sua marca sempre visível</li>
            <li>✓ Melhor ROI com presença consistente</li>
            <li>✓ Flexibilidade para pausar ou modificar</li>
          </ul>

          <h2>🚀 Próximos Passos:</h2>
          <p>Acesse nosso novo simulador de preços para ver exatamente quanto você pagará:</p>
          
          <a href="https://kadeh.io/pt/kadeh-ads/checkout-generic" class="button">
            Acessar Simulador de Preços
          </a>

          <h2>❓ Dúvidas?</h2>
          <p>Se você tiver dúvidas sobre os novos preços ou a opção de recorrência, entre em contato conosco:</p>
          <ul>
            <li>📧 Email: suporte@kadeh.io</li>
            <li>📞 Telefone: +55 (11) 3000-0000</li>
            <li>💬 Chat: Disponível em kadeh.io</li>
          </ul>

          <p>Obrigado por ser um cliente Kadeh!</p>
          <p><strong>Equipe Kadeh</strong></p>
        </div>

        <div class="footer">
          <p>© 2026 Kadeh - Navegação Indoor com IA</p>
          <p>Este é um email automático. Por favor, não responda diretamente.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

export const RECURRING_OFFER_EMAIL = {
  subject: "💰 Economize 50% com Recorrência no Kadeh Ads",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .offer-box { background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .offer-box h2 { margin: 0; font-size: 28px; }
        .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 15px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://kadeh.io/images/logo-kadeh.png" alt="Kadeh" style="max-height: 50px;">
        </div>
        <div class="header">
          <h1>💰 Economize 50% com Recorrência</h1>
        </div>

        <div class="content">
          <p>Olá,</p>
          
          <p>Temos uma oferta especial para você!</p>

          <div class="offer-box">
            <h2>50% OFF</h2>
            <p>Em campanhas recorrentes (3 pacotes)</p>
          </div>

          <h3>Como funciona:</h3>
          <ol>
            <li>Escolha sua campanha (duração, lojas, produtos)</li>
            <li>Selecione a opção "Com Recorrência"</li>
            <li>Receba 3 pacotes com 50% de desconto</li>
            <li>Mantenha sua marca sempre visível!</li>
          </ol>

          <h3>Exemplo de Economia:</h3>
          <p>Campanha de 5 dias com 5 produtos e 50+ lojas:</p>
          <ul>
            <li>Preço normal: R$ 42.000</li>
            <li>Com recorrência: R$ 63.000 (3 pacotes com 50% OFF)</li>
            <li>💰 Economia: Presença contínua por 15 dias!</li>
          </ul>

          <a href="https://kadeh.io/pt/kadeh-ads/checkout-generic" class="button">
            Contratar Agora com Desconto
          </a>

          <p>Não perca esta oportunidade de aumentar sua visibilidade com um ótimo preço!</p>
          <p><strong>Equipe Kadeh</strong></p>
        </div>

        <div class="footer">
          <p>© 2026 Kadeh - Navegação Indoor com IA</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

export const WELCOME_NEW_PRICING_EMAIL = {
  subject: "Bem-vindo ao Kadeh Ads - Conheça Nossa Nova Estrutura",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .feature-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; border-radius: 4px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 15px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://kadeh.io/images/logo-kadeh.png" alt="Kadeh" style="max-height: 50px;">
        </div>
        <div class="header">
          <h1>Bem-vindo ao Kadeh Ads!</h1>
          <p>Descubra como aumentar suas vendas com navegação inteligente</p>
        </div>

        <div class="content">
          <h2>O que é Kadeh Ads?</h2>
          <p>Kadeh Ads é a solução de publicidade indoor mais inovadora do Brasil, permitindo que você alcance clientes no momento exato em que estão buscando seus produtos.</p>

          <h2>Nossos Recursos:</h2>
          
          <div class="feature-box">
            <strong>🎯 Publicidade por Proximidade</strong><br>
            Seus anúncios aparecem quando clientes estão perto de suas lojas
          </div>

          <div class="feature-box">
            <strong>🔍 Busca Inteligente</strong><br>
            Anúncios aparecem quando clientes buscam seus produtos
          </div>

          <div class="feature-box">
            <strong>📊 Analytics em Tempo Real</strong><br>
            Acompanhe o desempenho de suas campanhas
          </div>

          <div class="feature-box">
            <strong>💰 Preços Competitivos</strong><br>
            Comece com pequenas campanhas e escale conforme necessário
          </div>

          <h2>Comece Agora:</h2>
          <a href="https://kadeh.io/pt/kadeh-ads/checkout-generic" class="button">
            Criar Minha Primeira Campanha
          </a>

          <p>Qualquer dúvida, estamos aqui para ajudar!</p>
          <p><strong>Equipe Kadeh</strong></p>
        </div>

        <div class="footer">
          <p>© 2026 Kadeh - Navegação Indoor com IA</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

import nodemailer from "nodemailer";
import { ENV } from "./env";

/**
 * Serviço de envio de emails para confirmações de pagamento
 * Utiliza nodemailer com configuração de SMTP
 * Em modo de teste, registra os emails no console
 */

// Configurar o transportador de email
let transporter: any = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // Modo de teste: usar testAccount do Ethereal
  console.warn(
    "[Email] SMTP credentials not configured. Using test mode (emails logged to console only)."
  );
  transporter = nodemailer.createTestAccount().then((testAccount: any) => {
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  });
}

/**
 * Interface para dados de confirmação de pagamento
 */
export interface PaymentConfirmationData {
  campaignId: number;
  companyName: string;
  contactEmail: string;
  productName: string;
  duration: string;
  numberOfStores: number;
  totalCost: number;
  startDate: Date;
  endDate: Date;
  stripeSessionId: string;
}

/**
 * Enviar email de confirmação para o cliente
 */
export async function sendClientConfirmationEmail(data: PaymentConfirmationData) {
  try {
    // Aguardar transporter se for Promise (modo teste)
    const mailer = await Promise.resolve(transporter);

    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #FF6B35; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: white; padding: 20px; }
            .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
            .details { background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #FF6B35; }
            .details-row { margin: 8px 0; }
            .label { font-weight: bold; color: #FF6B35; }
            .button { display: inline-block; background-color: #FF6B35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pagamento Confirmado - Kadeh Ads</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${data.companyName}</strong>,</p>
              
              <p>Seu pagamento foi processado com sucesso! Sua campanha de publicidade no Kadeh Ads foi ativada.</p>
              
              <div class="details">
                <h3 style="color: #FF6B35; margin-top: 0;">Detalhes da Campanha</h3>
                <div class="details-row">
                  <span class="label">ID da Campanha:</span> ${data.campaignId}
                </div>
                <div class="details-row">
                  <span class="label">Produto:</span> ${data.productName}
                </div>
                <div class="details-row">
                  <span class="label">Duração:</span> ${data.duration}
                </div>
                <div class="details-row">
                  <span class="label">Quantidade de Lojas:</span> ${data.numberOfStores}
                </div>
                <div class="details-row">
                  <span class="label">Valor Total:</span> R$ ${data.totalCost.toFixed(2)}
                </div>
                <div class="details-row">
                  <span class="label">Data de Início:</span> ${new Date(data.startDate).toLocaleDateString("pt-BR")}
                </div>
                <div class="details-row">
                  <span class="label">Data de Término:</span> ${new Date(data.endDate).toLocaleDateString("pt-BR")}
                </div>
                <div class="details-row">
                  <span class="label">ID da Sessão Stripe:</span> ${data.stripeSessionId}
                </div>
              </div>
              
              <p>Sua campanha está agora ativa e seus produtos estão sendo exibidos nos pontos de venda selecionados.</p>
              
              <p>Se tiver dúvidas ou precisar de suporte, entre em contato conosco através do email <strong>adm@kadeh.io</strong>.</p>
              
              <p>Obrigado por usar o Kadeh Ads!</p>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                Este é um email automático. Por favor, não responda a este email.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Kadeh. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@kadeh.io",
      to: data.contactEmail,
      subject: `Confirmação de Pagamento - Campanha Kadeh Ads #${data.campaignId}`,
      html: htmlContent,
    };

    const info = await mailer.sendMail(mailOptions);
    console.log(`[Email] Confirmação enviada para cliente: ${data.contactEmail}`, info.messageId);
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar confirmação para cliente:", error);
    return false;
  }
}

/**
 * Enviar email de notificação para o administrador
 */
export async function sendAdminNotificationEmail(data: PaymentConfirmationData) {
  try {
    // Aguardar transporter se for Promise (modo teste)
    const mailer = await Promise.resolve(transporter);
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: white; padding: 20px; }
            .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
            .details { background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #1a1a1a; }
            .details-row { margin: 8px 0; }
            .label { font-weight: bold; color: #1a1a1a; }
            .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nova Campanha Paga - Kadeh Ads</h1>
            </div>
            <div class="content">
              <p>Uma nova campanha foi paga e ativada no sistema.</p>
              
              <div class="alert">
                <strong>⚠️ Ação Necessária:</strong> Verifique se a campanha está corretamente configurada e ativa no sistema.
              </div>
              
              <div class="details">
                <h3 style="color: #1a1a1a; margin-top: 0;">Detalhes da Campanha</h3>
                <div class="details-row">
                  <span class="label">ID da Campanha:</span> ${data.campaignId}
                </div>
                <div class="details-row">
                  <span class="label">Empresa:</span> ${data.companyName}
                </div>
                <div class="details-row">
                  <span class="label">Email de Contato:</span> ${data.contactEmail}
                </div>
                <div class="details-row">
                  <span class="label">Produto:</span> ${data.productName}
                </div>
                <div class="details-row">
                  <span class="label">Duração:</span> ${data.duration}
                </div>
                <div class="details-row">
                  <span class="label">Quantidade de Lojas:</span> ${data.numberOfStores}
                </div>
                <div class="details-row">
                  <span class="label">Valor Total:</span> R$ ${data.totalCost.toFixed(2)}
                </div>
                <div class="details-row">
                  <span class="label">Data de Início:</span> ${new Date(data.startDate).toLocaleDateString("pt-BR")}
                </div>
                <div class="details-row">
                  <span class="label">Data de Término:</span> ${new Date(data.endDate).toLocaleDateString("pt-BR")}
                </div>
                <div class="details-row">
                  <span class="label">ID da Sessão Stripe:</span> ${data.stripeSessionId}
                </div>
              </div>
              
              <p>Acesse o painel de administração para revisar e gerenciar esta campanha.</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Kadeh. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@kadeh.io",
      to: "adm@kadeh.io",
      subject: `Nova Campanha Paga - Kadeh Ads #${data.campaignId}`,
      html: htmlContent,
    };

    const info = await mailer.sendMail(mailOptions);
    console.log("[Email] Notificação enviada para administrador", info.messageId);
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar notificação para administrador:", error);
    return false;
  }
}

/**
 * Verificar se o serviço de email está configurado
 */
export function isEmailServiceConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_FROM
  );
}

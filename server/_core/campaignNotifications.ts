import { getDb } from "../db";
import { notifyOwner } from "./notification";
import { adCampaigns } from "../../drizzle/schema";
import { eq, and, lt } from "drizzle-orm";

/**
 * Verificar campanhas próximas do término e enviar notificações
 */
export async function checkCampaignExpirations() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("Database connection failed");
      return;
    }

    // Buscar campanhas ativas que terminam nos próximos 3 dias
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const expiringCampaigns = await db
      .select()
      .from(adCampaigns)
      .where(
        and(
          eq(adCampaigns.status, "active"),
          lt(adCampaigns.endDate, threeDaysFromNow)
        )
      );

    for (const campaign of expiringCampaigns) {
      const daysRemaining = Math.ceil(
        (new Date(campaign.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Enviar notificação ao administrador
      await notifyOwner({
        title: `Campanha ${campaign.productName} Expirando em ${daysRemaining} Dias`,
        content: `A campanha "${campaign.productName}" da empresa ${campaign.companyName} expirará em ${daysRemaining} dias (${new Date(campaign.endDate).toLocaleDateString("pt-BR")}).`,
      });
    }

    console.log(`[Campaign Notifications] Checked ${expiringCampaigns.length} expiring campaigns`);
  } catch (error) {
    console.error("[Campaign Notifications] Error checking campaign expirations:", error);
  }
}

/**
 * Verificar campanhas que atingiram marcos de performance
 */
export async function checkCampaignMilestones() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("Database connection failed");
      return;
    }

    // Buscar campanhas ativas
    const activeCampaigns = await db
      .select()
      .from(adCampaigns)
      .where(eq(adCampaigns.status, "active"));

    for (const campaign of activeCampaigns) {
      // Simular dados de performance (em produção, esses dados viriam de um analytics service)
      const performanceData = {
        views: Math.floor(Math.random() * 10000),
        clicks: Math.floor(Math.random() * 2000),
        conversions: Math.floor(Math.random() * 500),
      };

      // Verificar se atingiu marco de 5000 visualizações
      if (performanceData.views >= 5000 && performanceData.views < 5100) {
        await notifyOwner({
          title: `Campanha ${campaign.productName} Atingiu 5000 Visualizações`,
          content: `A campanha "${campaign.productName}" atingiu 5000 visualizações! Cliques: ${performanceData.clicks}, Conversões: ${performanceData.conversions}.`,
        });
      }

      // Verificar se atingiu marco de 1000 cliques
      if (performanceData.clicks >= 1000 && performanceData.clicks < 1100) {
        await notifyOwner({
          title: `Campanha ${campaign.productName} Atingiu 1000 Cliques`,
          content: `A campanha "${campaign.productName}" atingiu 1000 cliques! Taxa de conversão: ${((performanceData.conversions / performanceData.clicks) * 100).toFixed(2)}%.`,
        });
      }
    }

    console.log(`[Campaign Notifications] Checked ${activeCampaigns.length} campaigns for milestones`);
  } catch (error) {
    console.error("[Campaign Notifications] Error checking campaign milestones:", error);
  }
}

/**
 * Verificar campanhas que precisam de renovação
 */
export async function checkCampaignRenewals() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("Database connection failed");
      return;
    }

    // Buscar campanhas que terminaram nos últimos 7 dias
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const completedCampaigns = await db
      .select()
      .from(adCampaigns)
      .where(
        and(
          eq(adCampaigns.status, "completed"),
          lt(adCampaigns.endDate, now)
        )
      );

    for (const campaign of completedCampaigns) {
      // Enviar notificação de renovação
      await notifyOwner({
        title: `Campanha ${campaign.productName} Concluída - Considere Renovar`,
        content: `A campanha "${campaign.productName}" foi concluída. Considere criar uma nova campanha para manter o momentum de vendas.`,
      });
    }

    console.log(`[Campaign Notifications] Checked ${completedCampaigns.length} completed campaigns for renewal`);
  } catch (error) {
    console.error("[Campaign Notifications] Error checking campaign renewals:", error);
  }
}

/**
 * Iniciar verificações periódicas de notificações
 */
export function startCampaignNotificationScheduler() {
  // Executar verificações a cada hora
  const interval = 60 * 60 * 1000; // 1 hora

  console.log("[Campaign Notifications] Starting campaign notification scheduler");

  // Executar imediatamente na inicialização
  checkCampaignExpirations();
  checkCampaignMilestones();
  checkCampaignRenewals();

  // Agendar verificações periódicas
  setInterval(() => {
    checkCampaignExpirations();
    checkCampaignMilestones();
    checkCampaignRenewals();
  }, interval);
}

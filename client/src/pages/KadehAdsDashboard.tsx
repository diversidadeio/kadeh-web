import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, MapPin, Package, Clock, CheckCircle, AlertCircle, XCircle, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CampaignDetailsModal } from "@/components/CampaignDetailsModal";

type CampaignStatus = "pending_approval" | "approved" | "rejected" | "payment_pending" | "active" | "completed" | "cancelled" | "refunded";

const statusConfig: Record<CampaignStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending_approval: { label: "Aguardando Aprovação", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" /> },
  approved: { label: "Aprovada", color: "bg-blue-100 text-blue-800", icon: <CheckCircle className="w-4 h-4" /> },
  rejected: { label: "Rejeitada", color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" /> },
  payment_pending: { label: "Pagamento Pendente", color: "bg-orange-100 text-orange-800", icon: <AlertCircle className="w-4 h-4" /> },
  active: { label: "Ativa", color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-4 h-4" /> },
  completed: { label: "Concluída", color: "bg-gray-100 text-gray-800", icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" /> },
  refunded: { label: "Reembolsada", color: "bg-purple-100 text-purple-800", icon: <AlertCircle className="w-4 h-4" /> },
};

export default function KadehAdsDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "startDate" | "totalCost">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  // Buscar campanhas do usuário
  const { data: campaignsData, isLoading, error } = trpc.campaigns.listUserCampaigns.useQuery(
    selectedStatus === "all"
      ? { sortBy, sortOrder }
      : { status: selectedStatus as CampaignStatus, sortBy, sortOrder }
  );

  const campaigns = campaignsData?.campaigns || [];

  // Calcular estatísticas
  const stats = useMemo(() => {
    return {
      total: campaigns.length,
      active: campaigns.filter(c => c.status === "active").length,
      pending: campaigns.filter(c => c.status === "pending_approval" || c.status === "payment_pending").length,
      completed: campaigns.filter(c => c.status === "completed").length,
      totalSpent: campaigns.reduce((sum, c) => sum + parseFloat(c.totalCost.toString()), 0),
    };
  }, [campaigns]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar o dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Por favor, faça login para visualizar suas campanhas.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard de Campanhas</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe suas campanhas do Kadeh Ads</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Campanhas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Campanhas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Investido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">R$ {stats.totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Botão de Exportação e Filtros */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <ExportButton />
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-lg border border-border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Filtrar por Status</label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Campanhas</SelectItem>
                  <SelectItem value="pending_approval">Aguardando Aprovação</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="payment_pending">Pagamento Pendente</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ordenar por</label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Data de Criação</SelectItem>
                  <SelectItem value="startDate">Data de Início</SelectItem>
                  <SelectItem value="totalCost">Valor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ordem</label>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Mais Recente</SelectItem>
                  <SelectItem value="asc">Mais Antigo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Lista de Campanhas */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando campanhas...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Erro ao Carregar Campanhas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error.message}</p>
            </CardContent>
          </Card>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardHeader className="text-center py-12">
              <CardTitle>Nenhuma Campanha Encontrada</CardTitle>
              <CardDescription>Você ainda não criou nenhuma campanha. Comece criando uma nova campanha!</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a href="/pt/kadeh-ads-campaign">Criar Nova Campanha</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const status = campaign.status as CampaignStatus;
              const config = statusConfig[status];
              const isActive = status === "active";
              const daysRemaining = campaign.endDate
                ? Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : 0;

              return (
                <Card key={campaign.id} className={isActive ? "border-green-200 bg-green-50" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{campaign.productName}</CardTitle>
                          <Badge className={config.color}>
                            {config.icon}
                            <span className="ml-1">{config.label}</span>
                          </Badge>
                        </div>
                        <CardDescription>Campanha #{campaign.id}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">R$ {parseFloat(campaign.totalCost.toString()).toFixed(2)}</div>
                        {isActive && daysRemaining > 0 && (
                          <p className="text-sm text-green-600 font-medium">{daysRemaining} dias restantes</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Lojas</p>
                          <p className="font-semibold">{campaign.numberOfStores}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duração</p>
                          <p className="font-semibold">{campaign.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Início</p>
                          <p className="font-semibold text-sm">
                            {format(new Date(campaign.startDate), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Término</p>
                          <p className="font-semibold text-sm">
                            {format(new Date(campaign.endDate), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCampaignId(campaign.id)}
                      >
                        Ver Detalhes
                      </Button>
                      {status === "payment_pending" && (
                        <Button size="sm" asChild>
                          <a href={`/pt/kadeh-ads-campaign?campaignId=${campaign.id}`}>Completar Pagamento</a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <CampaignDetailsModal
        campaignId={selectedCampaignId}
        isOpen={!!selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
      />
    </div>
  );
}

function ExportButton() {
  const { data: csvData, isLoading } = trpc.campaigns.exportCSV.useQuery();

  const handleExport = () => {
    if (!csvData?.csv) {
      alert("Nenhuma campanha para exportar");
      return;
    }

    const blob = new Blob([csvData.csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", csvData.filename);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isLoading}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {isLoading ? "Preparando..." : "Exportar em CSV"}
    </Button>
  );
}

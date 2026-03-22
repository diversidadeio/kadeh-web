import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, Barcode } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CampaignAnalytics } from "./CampaignAnalytics";

interface CampaignDetailsModalProps {
  campaignId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending_approval: { label: "Aguardando Aprovação", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Aprovada", color: "bg-blue-100 text-blue-800" },
  rejected: { label: "Rejeitada", color: "bg-red-100 text-red-800" },
  payment_pending: { label: "Pagamento Pendente", color: "bg-orange-100 text-orange-800" },
  active: { label: "Ativa", color: "bg-green-100 text-green-800" },
  completed: { label: "Concluída", color: "bg-gray-100 text-gray-800" },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800" },
  refunded: { label: "Reembolsada", color: "bg-purple-100 text-purple-800" },
};

export function CampaignDetailsModal({ campaignId, isOpen, onClose }: CampaignDetailsModalProps) {
  const { data, isLoading, error } = trpc.campaigns.getCampaignDetails.useQuery(
    { campaignId: campaignId || 0 },
    { enabled: !!campaignId && isOpen }
  );

  const campaign = data?.campaign;
  const products = data?.products || [];

  if (!campaignId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Campanha #{campaignId}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Carregando detalhes da campanha...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Erro ao Carregar Detalhes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error.message}</p>
            </CardContent>
          </Card>
        ) : campaign ? (
          <div className="space-y-6">
            {/* Informações Principais */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{campaign.productName}</CardTitle>
                    <CardDescription>Empresa: {campaign.companyName}</CardDescription>
                  </div>
                  <Badge className={statusConfig[campaign.status]?.color || ""}>
                    {statusConfig[campaign.status]?.label || campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-2xl font-bold text-accent">R$ {parseFloat(campaign.totalCost.toString()).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duração</p>
                    <p className="text-lg font-semibold">{campaign.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantidade de Lojas</p>
                    <p className="text-lg font-semibold">{campaign.numberOfStores}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Período da Campanha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Início</p>
                      <p className="font-semibold">
                        {format(new Date(campaign.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Término</p>
                      <p className="font-semibold">
                        {format(new Date(campaign.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{campaign.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{campaign.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CNPJ</p>
                  <p className="font-medium">{campaign.companyDocument}</p>
                </div>
              </CardContent>
            </Card>

            {/* Produtos */}
            {products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Produtos da Campanha</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product: any) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          {product.productImageUrl && (
                            <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={product.productImageUrl}
                                alt={product.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold">{product.productName}</p>
                            {product.productEAN13 && (
                              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <Barcode className="w-4 h-4" />
                                <span>{product.productEAN13}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detalhes de Preço */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detalhes do Cálculo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço Base</span>
                    <span className="font-medium">R$ {parseFloat(campaign.basePrice.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Multiplicador</span>
                    <span className="font-medium">{parseFloat(campaign.multiplier.toString()).toFixed(2)}x</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-accent">R$ {parseFloat(campaign.totalCost.toString()).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            {campaign.status === "active" && (
              <CampaignAnalytics
                campaignId={campaignId}
                campaignData={{
                  startDate: new Date(campaign.startDate),
                  endDate: new Date(campaign.endDate),
                }}
              />
            )}

            {/* Ações */}
            <div className="flex gap-2 justify-end">
              {campaign.status === "payment_pending" && (
                <Button asChild>
                  <a href={`/pt/kadeh-ads-campaign?campaignId=${campaignId}`}>Completar Pagamento</a>
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, XCircle, DollarSign } from "lucide-react";

export function AdminAdsPanel() {
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch pending advertisers
  const { data: pendingAdvertisers, isLoading: loadingPending, refetch: refetchPending } = trpc.ads.getPendingAdvertisers.useQuery();

  // Approve advertiser mutation
  const approveAdvertiserMutation = trpc.ads.approveAdvertiser.useMutation({
    onSuccess: () => {
      refetchPending();
    },
  });

  // Reject advertiser mutation
  const rejectAdvertiserMutation = trpc.ads.rejectAdvertiser.useMutation({
    onSuccess: () => {
      refetchPending();
    },
  });

  // Fetch pricing plans
  const { data: pricingPlans } = trpc.ads.getPricingPlans.useQuery();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Anunciantes Pendentes</TabsTrigger>
          <TabsTrigger value="pricing">Tabela de Preços</TabsTrigger>
          <TabsTrigger value="active">Anúncios Ativos</TabsTrigger>
        </TabsList>

        {/* Pending Advertisers Tab */}
        <TabsContent value="pending" className="space-y-4">
          {loadingPending ? (
            <div className="text-center py-8">Carregando...</div>
          ) : !pendingAdvertisers || pendingAdvertisers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Nenhum anunciante pendente de aprovação</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingAdvertisers.map((advertiser) => (
                <Card key={advertiser.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{advertiser.companyName}</CardTitle>
                    <CardDescription>
                      CNPJ: {advertiser.companyDocument} | Email: {advertiser.contactEmail}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold">Telefone</p>
                          <p>{advertiser.contactPhone || "Não informado"}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Website</p>
                          <p>{advertiser.website || "Não informado"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() =>
                            rejectAdvertiserMutation.mutate({
                              advertiserId: advertiser.id,
                              reason: "Rejeitado pelo administrador",
                            })
                          }
                          disabled={rejectAdvertiserMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                        <Button
                          onClick={() =>
                            approveAdvertiserMutation.mutate({
                              advertiserId: advertiser.id,
                            })
                          }
                          disabled={approveAdvertiserMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pricing Plans Tab */}
        <TabsContent value="pricing" className="space-y-4">
          {!pricingPlans || pricingPlans.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Nenhuma tabela de preços configurada</p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Duração</th>
                    <th className="text-left py-2 px-4">Mín. Lojas</th>
                    <th className="text-left py-2 px-4">Máx. Lojas</th>
                    <th className="text-left py-2 px-4">Preço por Loja</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingPlans.map((plan) => (
                    <tr key={plan.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">
                        {plan.duration === "1day" && "1 dia"}
                        {plan.duration === "3days" && "3 dias"}
                        {plan.duration === "7days" && "7 dias"}
                        {plan.duration === "14days" && "14 dias"}
                      </td>
                      <td className="py-2 px-4">{plan.minStores}</td>
                      <td className="py-2 px-4">{plan.maxStores === 999999 ? "Ilimitado" : plan.maxStores}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {parseFloat(plan.pricePerStore).toFixed(2)}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        {plan.isActive ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            Inativo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Active Ads Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anúncios Ativos</CardTitle>
              <CardDescription>
                Visualize todos os anúncios ativos no sistema com suas métricas de desempenho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdsAnalyticsDashboard from "@/components/AdsAnalyticsDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function AdsAdvertiserDashboard() {
  // Dados simulados de anúncios
  const ads = [
    {
      id: "1",
      title: "Promoção de Bebidas",
      status: "approved",
      impressions: 5420,
      clicks: 342,
      conversions: 67,
      revenue: 1340,
    },
    {
      id: "2",
      title: "Oferta de Alimentos",
      status: "pending",
      impressions: 3210,
      clicks: 215,
      conversions: 38,
      revenue: 760,
    },
    {
      id: "3",
      title: "Desconto em Higiene",
      status: "approved",
      impressions: 3820,
      clicks: 290,
      conversions: 51,
      revenue: 1020,
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      approved: "Aprovado",
      pending: "Pendente",
      rejected: "Rejeitado",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard de Anunciante</h1>
          <p className="text-lg text-gray-600">
            Acompanhe o desempenho de seus anúncios em tempo real
          </p>
        </div>

        {/* Analytics Dashboard */}
        <AdsAnalyticsDashboard />

        {/* Seus Anúncios */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Seus Anúncios</h2>

          <div className="space-y-4">
            {ads.map((ad) => (
              <Card key={ad.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-lg">{ad.title}</h3>
                      <p className="text-sm text-gray-600">ID: {ad.id}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Impressões</p>
                      <p className="font-bold text-lg">{ad.impressions.toLocaleString()}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Cliques</p>
                      <p className="font-bold text-lg">{ad.clicks.toLocaleString()}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Conversões</p>
                      <p className="font-bold text-lg">{ad.conversions.toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {getStatusBadge(ad.status)}
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Criar Novo Anúncio */}
        <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Criar Novo Anúncio</h3>
              <p className="text-gray-700">
                Comece a anunciar seus produtos e alcance mais clientes no ponto de venda
              </p>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Novo Anúncio
            </Button>
          </div>
        </div>

        {/* Status de Aprovação */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Aprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2</p>
              <p className="text-sm text-gray-600 mt-2">Anúncios ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1</p>
              <p className="text-sm text-gray-600 mt-2">Aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Rejeitados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-gray-600 mt-2">Nenhum anúncio rejeitado</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

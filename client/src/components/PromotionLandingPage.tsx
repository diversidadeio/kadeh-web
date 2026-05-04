import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Store, Package, TrendingUp, MapPin, Phone, Mail } from "lucide-react";

interface PromotionLandingPageProps {
  retailerCode: string;
}

export function PromotionLandingPage({ retailerCode }: PromotionLandingPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promotionData, setPromotionData] = useState<any>(null);

  // Buscar dados do varejista
  const { data: statsData, isLoading, error: queryError } = trpc.ads.getRetailerStats.useQuery(
    { retailerCode },
    { enabled: !!retailerCode }
  );

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else if (queryError) {
      setError(queryError.message || "Erro ao carregar promoção");
      setLoading(false);
    } else if (statsData?.success) {
      setPromotionData(statsData);
      setLoading(false);
    } else {
      setError("Promoção não encontrada");
      setLoading(false);
    }
  }, [isLoading, queryError, statsData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando promoção...</p>
        </div>
      </div>
    );
  }

  if (error || !promotionData?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <Card className="max-w-md w-full p-6 bg-white border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-900">Promoção não encontrada</h2>
          </div>
          <p className="text-red-700 mb-4">
            {error || "O código de promoção fornecido não é válido ou expirou."}
          </p>
          <Button
            onClick={() => window.location.href = "/"}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">Promoção Especial</h1>
          <p className="text-blue-100 text-lg">
            Confira os produtos em destaque desta loja
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Retailer Info Card */}
        <Card className="mb-8 overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Store className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Código: {promotionData.retailerCode}</h2>
            </div>
            <p className="text-blue-100">
              {promotionData.status === "active" ? "Promoção Ativa" : "Promoção Inativa"}
            </p>
          </div>

          <div className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Store className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Lojas Participantes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {promotionData.storeCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Produtos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {promotionData.productCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Produtos Anunciados</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {promotionData.advertisedProductCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotion Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Promoção</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Localização</p>
                    <p className="text-gray-900 font-medium">
                      Disponível em {promotionData.storeCount} {promotionData.storeCount === 1 ? "loja" : "lojas"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Produtos em Destaque</p>
                    <p className="text-gray-900 font-medium">
                      {promotionData.advertisedProductCount} de {promotionData.productCount} produtos anunciados
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-gray-900 font-medium capitalize">
                      {promotionData.status === "active" ? "✅ Ativa" : "⏸️ Inativa"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Aproveite esta Promoção!
          </h3>
          <p className="text-gray-600 mb-6">
            Visite a loja e aproveite os produtos em destaque. Válido enquanto durar o estoque.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.location.href = "/"}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Voltar para Home
            </Button>
            
            <Button
              onClick={() => {
                const text = encodeURIComponent(
                  `Confira a promoção especial com código ${promotionData.retailerCode}!\n${window.location.href}`
                );
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }}
              variant="outline"
              className="border-green-200 hover:bg-green-50"
            >
              Compartilhar no WhatsApp
            </Button>
          </div>
        </Card>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Dúvidas sobre esta promoção?</p>
          <div className="flex justify-center gap-6">
            <a href="mailto:adm@kadeh.io" className="flex items-center gap-2 hover:text-blue-600">
              <Mail className="w-4 h-4" />
              adm@kadeh.io
            </a>
            <a href="tel:+5511999999999" className="flex items-center gap-2 hover:text-blue-600">
              <Phone className="w-4 h-4" />
              (11) 99999-9999
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

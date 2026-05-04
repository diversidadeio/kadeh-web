import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, QrCode, TrendingUp, Package, Store } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface AdsRetailerDashboardProps {
  advertisementId: number;
  onClose?: () => void;
}

export function AdsRetailerDashboard({ advertisementId, onClose }: AdsRetailerDashboardProps) {
  const { user } = useAuth();
  const [storeCount, setStoreCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  // Gerar link de promoção
  const generateLinkMutation = trpc.ads.generatePromotionLink.useMutation();
  
  // Atualizar estatísticas
  const updateStatsMutation = trpc.ads.updateRetailerStats.useMutation();

  const [promotionData, setPromotionData] = useState<{
    retailerCode: string;
    promotionLink: string;
    storeCount: number;
    productCount: number;
    advertisedProductCount: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gerar link de promoção
  const handleGenerateLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateLinkMutation.mutateAsync({
        advertisementId,
        storeCount,
      });
      
      // Atualizar estatísticas iniciais
      await updateStatsMutation.mutateAsync({
        advertisementId,
        storeCount,
        productCount: 0,
        advertisedProductCount: 0,
      });
      
      setPromotionData({
        retailerCode: result.retailerCode,
        promotionLink: result.promotionLink,
        storeCount,
        productCount: 0,
        advertisedProductCount: 0,
      });
    } catch (err: any) {
      setError(err.message || "Erro ao gerar link de promoção");
    } finally {
      setLoading(false);
    }
  };

  // Copiar link para clipboard
  const handleCopyLink = () => {
    if (promotionData?.promotionLink) {
      navigator.clipboard.writeText(promotionData.promotionLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Copiar código do varejista
  const handleCopyCode = () => {
    if (promotionData?.retailerCode) {
      navigator.clipboard.writeText(promotionData.retailerCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Compartilhar no WhatsApp
  const handleShareWhatsApp = () => {
    if (promotionData?.promotionLink) {
      const text = encodeURIComponent(
        `Confira nossos produtos anunciados no Kadeh.io Ads!\n${promotionData.promotionLink}`
      );
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  };

  // Compartilhar no Facebook
  const handleShareFacebook = () => {
    if (promotionData?.promotionLink) {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(promotionData.promotionLink)}`,
        "_blank"
      );
    }
  };

  // Gerar QR Code (usando API externa)
  const handleGenerateQR = () => {
    setQrCodeVisible(!qrCodeVisible);
  };

  if (!user) {
    return (
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <p className="text-yellow-800">Por favor, faça login para acessar o dashboard de promoções.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard de Promoções Kadeh.io Ads</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {!promotionData ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeCount" className="text-gray-700 font-semibold">
                Quantidade de Lojas
              </Label>
              <Input
                id="storeCount"
                type="number"
                min="1"
                value={storeCount}
                onChange={(e) => setStoreCount(parseInt(e.target.value) || 1)}
                className="mt-2"
              />
              <p className="text-sm text-gray-600 mt-1">
                Selecione quantas lojas participarão desta promoção
              </p>
            </div>

            <Button
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Gerando..." : "Gerar Link de Promoção"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Código do Varejista */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Código Único do Varejista</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-gray-100 rounded font-mono text-lg font-bold text-gray-900">
                  {promotionData.retailerCode}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Este código identifica sua loja de forma única no sistema
              </p>
            </div>

            {/* Link de Promoção */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Link de Promoção</h3>
              <div className="flex items-center gap-2">
                <Input
                  value={promotionData.promotionLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Compartilhe este link com seus clientes
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-3">
                  <Store className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Lojas Participantes</p>
                    <p className="text-2xl font-bold text-gray-900">{promotionData.storeCount}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Produtos</p>
                    <p className="text-2xl font-bold text-gray-900">{promotionData.productCount}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-purple-50 border-purple-200">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Produtos Anunciados</p>
                    <p className="text-2xl font-bold text-gray-900">{promotionData.advertisedProductCount}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Opções de Compartilhamento */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Compartilhar Promoção</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={handleShareWhatsApp}
                  variant="outline"
                  className="gap-2 border-green-200 hover:bg-green-50"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </Button>

                <Button
                  onClick={handleShareFacebook}
                  variant="outline"
                  className="gap-2 border-blue-200 hover:bg-blue-50"
                >
                  <Share2 className="w-4 h-4" />
                  Facebook
                </Button>

                <Button
                  onClick={handleGenerateQR}
                  variant="outline"
                  className="gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  {qrCodeVisible ? "Ocultar" : "QR Code"}
                </Button>
              </div>

              {qrCodeVisible && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      promotionData.promotionLink
                    )}`}
                    alt="QR Code"
                    className="mx-auto"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Escaneie o QR Code para acessar a promoção
                  </p>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setPromotionData(null);
                  setStoreCount(1);
                }}
                variant="outline"
                className="flex-1"
              >
                Gerar Novo Link
              </Button>
              {onClose && (
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                >
                  Fechar
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

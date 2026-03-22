import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';

interface KadehAdsPaymentProps {
  storeRange: string;
  numberOfProducts: number;
  campaignDuration: number;
  campaignName: string;
  companyName: string;
  companyEmail: string;
  onPaymentSuccess?: () => void;
}

export function KadehAdsPayment({
  storeRange,
  numberOfProducts,
  campaignDuration,
  campaignName,
  companyName,
  companyEmail,
  onPaymentSuccess,
}: KadehAdsPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createCheckoutMutation.mutateAsync({
        numberOfStores: parseInt(storeRange) || 1,
        productName: campaignName,
        companyName,
        email: companyEmail,
        cnpj: "",
        phone: "",
        ean13: "",
        duration: campaignDuration as any,
        productImageUrl: "",
      });

      if (response.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.open(response.checkoutUrl, '_blank');
        onPaymentSuccess?.();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar sessão de pagamento'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Opções de Pagamento</CardTitle>
        <CardDescription>
          Campanha de {campaignDuration} dia(s) para {storeRange}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Resumo da Campanha</p>
          <div className="bg-slate-50 p-3 rounded-lg space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Empresa:</span>
              <span className="font-medium">{companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Campanha:</span>
              <span className="font-medium">{campaignName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Duração:</span>
              <span className="font-medium">{campaignDuration} dia(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Lojas:</span>
              <span className="font-medium">{storeRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Produtos:</span>
              <span className="font-medium">{numberOfProducts}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Pagar com Stripe'
            )}
          </Button>
          <p className="text-xs text-slate-500 text-center mt-2">
            Você será redirecionado para o Stripe Checkout
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Use o cartão de teste <strong>4242 4242 4242 4242</strong> para testes
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

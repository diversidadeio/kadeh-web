import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface StripeCheckoutProps {
  campaignName: string;
  productName: string;
  amount: number;
  currency?: string;
  duration: number;
  stores: number;
  advertiserId: string;
  language: string;
}

export default function StripeCheckout({
  campaignName,
  productName,
  amount,
  currency = "BRL",
  duration,
  stores,
  advertiserId,
  language,
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  const texts = {
    pt: {
      proceedToPayment: "Prosseguir para Pagamento",
      processing: "Processando...",
      paymentDetails: "Detalhes do Pagamento",
      campaignInfo: "Informações da Campanha",
      duration: "Duração",
      stores: "Lojas",
      amount: "Valor",
      days: "dias",
      paymentSuccess: "Pagamento iniciado com sucesso!",
      redirecting: "Redirecionando para Stripe Checkout...",
      error: "Erro ao processar pagamento",
      tryAgain: "Tentar Novamente",
    },
    en: {
      proceedToPayment: "Proceed to Payment",
      processing: "Processing...",
      paymentDetails: "Payment Details",
      campaignInfo: "Campaign Information",
      duration: "Duration",
      stores: "Stores",
      amount: "Amount",
      days: "days",
      paymentSuccess: "Payment initiated successfully!",
      redirecting: "Redirecting to Stripe Checkout...",
      error: "Error processing payment",
      tryAgain: "Try Again",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createCheckoutMutation.mutateAsync({
        campaignName,
        productName,
        amount,
        currency,
        duration,
        stores,
        advertiserId,
      });

      if (result.url) {
        setSuccess(true);
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        setError(t.error);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t.paymentDetails}</CardTitle>
        <CardDescription>{t.campaignInfo}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Campaign Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t.duration}</p>
              <p className="text-lg font-semibold">
                {duration} {t.days}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t.stores}</p>
              <p className="text-lg font-semibold">{stores}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">{t.amount}</p>
            <p className="text-2xl font-bold">
              {currency === "BRL" ? "R$" : "$"} {(amount / 100).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {t.paymentSuccess}
              <br />
              <span className="text-sm">{t.redirecting}</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={isLoading || success}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.processing}
            </>
          ) : (
            t.proceedToPayment
          )}
        </Button>

        {/* Retry Button */}
        {error && !isLoading && (
          <Button
            onClick={handleCheckout}
            variant="outline"
            className="w-full"
          >
            {t.tryAgain}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

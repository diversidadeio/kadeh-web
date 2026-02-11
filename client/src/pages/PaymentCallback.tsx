import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PaymentCallback() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [sessionData, setSessionData] = useState<any>(null);

  const getCheckoutSessionQuery = trpc.stripe.getCheckoutSession.useQuery(
    { sessionId: new URLSearchParams(window.location.search).get("session_id") || "" },
    { enabled: !!new URLSearchParams(window.location.search).get("session_id") }
  );

  const texts = {
    pt: {
      paymentSuccess: "Pagamento Realizado com Sucesso!",
      paymentCancelled: "Pagamento Cancelado",
      processingPayment: "Processando Pagamento...",
      successDescription: "Seu pagamento foi processado com sucesso. Sua campanha será ativada em breve.",
      cancelledDescription: "Você cancelou o pagamento. Nenhuma cobrança foi realizada.",
      errorDescription: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
      backToDashboard: "Voltar ao Dashboard",
      tryAgain: "Tentar Novamente",
      sessionId: "ID da Sessão",
      amount: "Valor",
      status: "Status",
    },
    en: {
      paymentSuccess: "Payment Successful!",
      paymentCancelled: "Payment Cancelled",
      processingPayment: "Processing Payment...",
      successDescription: "Your payment has been processed successfully. Your campaign will be activated shortly.",
      cancelledDescription: "You cancelled the payment. No charges were made.",
      errorDescription: "An error occurred while processing your payment. Please try again.",
      backToDashboard: "Back to Dashboard",
      tryAgain: "Try Again",
      sessionId: "Session ID",
      amount: "Amount",
      status: "Status",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("status");

    if (paymentStatus === "success" && getCheckoutSessionQuery.data) {
      setStatus("success");
      setSessionData(getCheckoutSessionQuery.data);
    } else if (paymentStatus === "cancel") {
      setStatus("error");
    } else if (getCheckoutSessionQuery.isLoading) {
      setStatus("loading");
    }
  }, [getCheckoutSessionQuery.data, getCheckoutSessionQuery.isLoading]);

  const handleBackToDashboard = () => {
    navigate("/advertiser-portal");
  };

  const handleTryAgain = () => {
    navigate("/advertiser-portal?tab=create");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {status === "loading" && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <p className="text-lg font-semibold">{t.processingPayment}</p>
              </CardContent>
            </Card>
          )}

          {status === "success" && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle className="text-green-900">{t.paymentSuccess}</CardTitle>
                    <CardDescription className="text-green-800">
                      {t.successDescription}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {sessionData && (
                  <div className="space-y-4 bg-white p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t.sessionId}</p>
                        <p className="font-mono text-sm break-all">{sessionData.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t.amount}</p>
                        <p className="text-lg font-semibold">
                          R$ {((sessionData.amountTotal || 0) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleBackToDashboard} className="w-full" size="lg">
                  {t.backToDashboard}
                </Button>
              </CardContent>
            </Card>
          )}

          {status === "error" && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <CardTitle className="text-red-900">{t.paymentCancelled}</CardTitle>
                    <CardDescription className="text-red-800">
                      {t.cancelledDescription}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertDescription>{t.errorDescription}</AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button onClick={handleTryAgain} className="flex-1" size="lg">
                    {t.tryAgain}
                  </Button>
                  <Button onClick={handleBackToDashboard} variant="outline" className="flex-1" size="lg">
                    {t.backToDashboard}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

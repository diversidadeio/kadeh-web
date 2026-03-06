import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

const translations = {
  pt: {
    title: "Pagamento Cancelado",
    subtitle: "Sua transação foi cancelada",
    reason: "O que aconteceu?",
    reasonText: "Você cancelou o processo de pagamento. Sua campanha não foi criada.",
    nextSteps: "O que fazer agora?",
    step1: "Verifique os dados da sua campanha",
    step2: "Tente novamente com as informações corretas",
    step3: "Entre em contato conosco se tiver dúvidas",
    tryAgain: "Tentar Novamente",
    backHome: "Voltar para Início",
    contact: "Entrar em Contato",
  },
  en: {
    title: "Payment Cancelled",
    subtitle: "Your transaction has been cancelled",
    reason: "What happened?",
    reasonText: "You cancelled the payment process. Your campaign was not created.",
    nextSteps: "What to do now?",
    step1: "Check your campaign details",
    step2: "Try again with the correct information",
    step3: "Contact us if you have any questions",
    tryAgain: "Try Again",
    backHome: "Back to Home",
    contact: "Contact Us",
  },
};

export default function KadehAdsCancel() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const t = translations[lang];

  useEffect(() => {
    // Detect language from URL
    const path = window.location.pathname;
    if (path.includes("/en/")) {
      setLang("en");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-20 h-20 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </div>

        {/* What Happened */}
        <Card className="mb-6 border-2 border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle className="text-red-700">{t.reason}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700">{t.reasonText}</p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t.nextSteps}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.step1}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.step2}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.step3}</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={lang === "pt" ? "/pt/kadeh-ads/checkout" : "/en/kadeh-ads/checkout"}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.tryAgain}
            </Button>
          </Link>
          <Link href={lang === "pt" ? "/pt" : "/en"}>
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              {t.backHome}
            </Button>
          </Link>
          <Link href={lang === "pt" ? "/pt/contact" : "/en/contact"}>
            <Button variant="outline" className="w-full">
              {t.contact}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

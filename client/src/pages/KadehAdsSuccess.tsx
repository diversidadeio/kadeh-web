import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { Link } from "wouter";

const translations = {
  pt: {
    title: "Pagamento Realizado com Sucesso!",
    subtitle: "Sua campanha foi criada e está aguardando aprovação",
    confirmationNumber: "Número de Confirmação",
    campaignStatus: "Status da Campanha",
    nextSteps: "Próximos Passos",
    step1: "Sua campanha foi registrada no sistema",
    step2: "Nosso time de administradores irá revisar e aprovar",
    step3: "Você receberá um email de confirmação",
    step4: "Após aprovação, sua campanha será ativada",
    viewCampaign: "Ver Minha Campanha",
    createNew: "Criar Nova Campanha",
    backHome: "Voltar para Início",
    emailSent: "Um email de confirmação foi enviado para seu endereço de email",
    approvalTime: "A aprovação geralmente leva até 24 horas",
  },
  en: {
    title: "Payment Successful!",
    subtitle: "Your campaign has been created and is awaiting approval",
    confirmationNumber: "Confirmation Number",
    campaignStatus: "Campaign Status",
    nextSteps: "Next Steps",
    step1: "Your campaign has been registered in the system",
    step2: "Our admin team will review and approve it",
    step3: "You will receive a confirmation email",
    step4: "After approval, your campaign will be activated",
    viewCampaign: "View My Campaign",
    createNew: "Create New Campaign",
    backHome: "Back to Home",
    emailSent: "A confirmation email has been sent to your email address",
    approvalTime: "Approval usually takes up to 24 hours",
  },
};

export default function KadehAdsSuccess() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const t = translations[lang];
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session ID from URL params
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");
    setSessionId(id);

    // Detect language from URL or browser
    const path = window.location.pathname;
    if (path.includes("/en/")) {
      setLang("en");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-600 animate-bounce" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </div>

        {/* Confirmation Card */}
        <Card className="mb-6 border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-green-700">{t.confirmationNumber}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">ID da Sessão</p>
              <p className="text-2xl font-mono font-bold text-gray-900 break-all">{sessionId || "---"}</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">{t.emailSent}</p>
            <p className="text-sm text-gray-600">{t.approvalTime}</p>
          </CardContent>
        </Card>

        {/* Campaign Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t.campaignStatus}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">Pagamento Processado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse" />
                </div>
                <span className="text-gray-700">Aguardando Aprovação</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
                <span className="text-gray-500">Campanha Ativa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t.nextSteps}</CardTitle>
            <CardDescription>O que acontece agora</CardDescription>
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
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  4
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.step4}</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={lang === "pt" ? "/pt/kadeh-ads/checkout" : "/en/kadeh-ads/checkout"}>
            <Button variant="outline" className="w-full">
              <ArrowRight className="w-4 h-4 mr-2" />
              {t.createNew}
            </Button>
          </Link>
          <Link href={lang === "pt" ? "/pt" : "/en"}>
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              {t.backHome}
            </Button>
          </Link>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {t.viewCampaign}
          </Button>
        </div>
      </div>
    </div>
  );
}

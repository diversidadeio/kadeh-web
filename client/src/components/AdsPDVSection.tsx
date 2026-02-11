import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, MapPin, Zap, Target } from "lucide-react";
import AdsSimulator from "./AdsSimulator";

export default function AdsPDVSection({ language }: { language: string }) {
  const texts = {
    pt: {
      title: "Ads no PDV",
      subtitle: "Sistema de Publicidade Contextualizada no Ponto de Venda",
      splitPayment: "Split de Pagamento",
      splitDescription: "Como funciona o modelo de repasse de receita",
      advertiserPays: "O Anunciante Paga",
      kadehKeeps: "Kadeh Retém",
      storeReceives: "Loja/Shopping Recebe",
      example: "Exemplo: Campanha de R$ 1.000",
      flowTitle: "Como Anunciar",
      flowSubtitle: "5 passos simples para começar a anunciar",
      step1: "Cadastro",
      step1Desc: "Crie sua conta e aprove seus dados",
      step2: "Criar Anúncio",
      step2Desc: "Escolha produto, imagem e tipo de anúncio",
      step3: "Configurar Campanha",
      step3Desc: "Selecione lojas, duração e gatilho",
      step4: "Revisar Investimento",
      step4Desc: "Veja o ROI estimado antes de pagar",
      step5: "Ativar",
      step5Desc: "Pague e sua campanha começa",
      simulator: "Simulador de Investimento",
      cta: "Começar a Anunciar",
    },
    en: {
      title: "Ads at POS",
      subtitle: "Context-Aware Advertising System at Point of Sale",
      splitPayment: "Payment Split",
      splitDescription: "How revenue sharing works",
      advertiserPays: "Advertiser Pays",
      kadehKeeps: "Kadeh Retains",
      storeReceives: "Store/Mall Receives",
      example: "Example: R$ 1,000 Campaign",
      flowTitle: "How to Advertise",
      flowSubtitle: "5 simple steps to start advertising",
      step1: "Registration",
      step1Desc: "Create your account and approve your data",
      step2: "Create Ad",
      step2Desc: "Choose product, image and ad type",
      step3: "Configure Campaign",
      step3Desc: "Select stores, duration and trigger",
      step4: "Review Investment",
      step4Desc: "See estimated ROI before paying",
      step5: "Activate",
      step5Desc: "Pay and your campaign starts",
      simulator: "Investment Simulator",
      cta: "Start Advertising",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  return (
    <div className="w-full space-y-16 py-12">
      {/* Split de Pagamento */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-gray-900">{t.splitPayment}</h2>
          <p className="text-xl text-gray-600">{t.splitDescription}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visualização do Split */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.example}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">{t.advertiserPays}</span>
                    <span className="text-2xl font-bold text-blue-600">R$ 1.000</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <span className="font-medium text-gray-700">{t.kadehKeeps}</span>
                    <span className="text-2xl font-bold text-orange-600">R$ 800 (80%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-700">{t.storeReceives}</span>
                    <span className="text-2xl font-bold text-green-600">R$ 200 (20%)</span>
                  </div>
                </div>

                {/* Gráfico de Pizza */}
                <div className="flex items-center justify-center h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full max-w-xs">
                    {/* Kadeh 80% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="30"
                      strokeDasharray="226.2 282.7"
                      transform="rotate(-90 50 50)"
                    />
                    {/* Store 20% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="30"
                      strokeDasharray="56.7 282.7"
                      strokeDashoffset="-226.2"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="55" textAnchor="middle" className="text-xs font-bold" fill="#333">
                      Split
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefícios */}
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex gap-4">
                  <TrendingUp className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Para Lojas/Shopping</h3>
                    <p className="text-sm text-gray-700">Receita adicional com 70% do investimento em publicidade</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex gap-4">
                  <Zap className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Para Anunciantes</h3>
                    <p className="text-sm text-gray-700">Publicidade contextualizada no momento da decisão de compra</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex gap-4">
                  <Target className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Para Kadeh</h3>
                    <p className="text-sm text-gray-700">Plataforma de publicidade escalável com 30% de comissão</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fluxo do Anunciante */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-gray-900">{t.flowTitle}</h2>
          <p className="text-xl text-gray-600">{t.flowSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: 1, title: t.step1, desc: t.step1Desc, icon: "👤" },
            { step: 2, title: t.step2, desc: t.step2Desc, icon: "📸" },
            { step: 3, title: t.step3, desc: t.step3Desc, icon: "⚙️" },
            { step: 4, title: t.step4, desc: t.step4Desc, icon: "📊" },
            { step: 5, title: t.step5, desc: t.step5Desc, icon: "✅" },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <Card className="h-full">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold mx-auto">
                    {item.step}
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
              {idx < 4 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-blue-600 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Simulador */}
      <section className="space-y-8 bg-gray-50 p-8 rounded-lg">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-gray-900">{t.simulator}</h2>
        </div>
        <AdsSimulator language={language} />
      </section>
    </div>
  );
}

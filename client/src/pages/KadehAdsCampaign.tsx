import { KadehAdsCampaignForm } from "@/components/KadehAdsCampaignForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { Zap, BarChart3, TrendingUp, Target, Users, DollarSign } from "lucide-react";
import { KadehAdsCostSimulator } from "@/components/KadehAdsCostSimulator";

export default function KadehAdsCampaignPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const benefits = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: language === "pt" ? "Publicidade Direcionada" : "Targeted Advertising",
      description: language === "pt" 
        ? "Alcance clientes no momento certo, no lugar certo com anúncios personalizados"
        : "Reach customers at the right time, in the right place with personalized ads"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: language === "pt" ? "Analytics em Tempo Real" : "Real-Time Analytics",
      description: language === "pt"
        ? "Acompanhe impressões, cliques e conversões com dashboard detalhado"
        : "Track impressions, clicks and conversions with detailed dashboard"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: language === "pt" ? "Aumento de Vendas" : "Increased Sales",
      description: language === "pt"
        ? "Aumente o ticket médio e a conversão com posicionamento estratégico"
        : "Increase average ticket and conversion with strategic positioning"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: language === "pt" ? "Categorias Correlacionadas" : "Correlated Categories",
      description: language === "pt"
        ? "Sugestões de IA para posicionar seu produto junto a complementares"
        : "AI suggestions to position your product with complementary items"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-600" />,
      title: language === "pt" ? "Preços Competitivos" : "Competitive Pricing",
      description: language === "pt"
        ? "Pacotes flexíveis adaptados ao tamanho da sua rede de lojas"
        : "Flexible packages adapted to your store network size"
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: language === "pt" ? "Implementação Rápida" : "Quick Implementation",
      description: language === "pt"
        ? "Ative suas campanhas em minutos, sem complicações técnicas"
        : "Activate your campaigns in minutes, without technical complications"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: language === "pt" ? "Cadastre sua Empresa" : "Register Your Company",
      description: language === "pt"
        ? "Preencha informações básicas da sua empresa e aprove os termos"
        : "Fill in basic company information and approve terms"
    },
    {
      step: "2",
      title: language === "pt" ? "Configure sua Campanha" : "Configure Your Campaign",
      description: language === "pt"
        ? "Escolha duração, quantidade de lojas e carregue imagem do produto"
        : "Choose duration, number of stores and upload product image"
    },
    {
      step: "3",
      title: language === "pt" ? "Visualize Posicionamento" : "Preview Positioning",
      description: language === "pt"
        ? "Veja onde seu anúncio aparecerá no Kadeh Varejo antes de pagar"
        : "See where your ad will appear in Kadeh Retail before paying"
    },
    {
      step: "4",
      title: language === "pt" ? "Pague e Ative" : "Pay and Activate",
      description: language === "pt"
        ? "Processe o pagamento e sua campanha fica ativa imediatamente"
        : "Process payment and your campaign goes live immediately"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {language === "pt" ? "Kadeh Ads" : "Kadeh Ads"}
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                {language === "pt"
                  ? "Publicidade inteligente no ponto de venda. Posicione seus produtos onde os clientes mais compram com dados em tempo real."
                  : "Smart point-of-sale advertising. Position your products where customers buy most with real-time data."}
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => setShowFormModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto"
                >
                  {language === "pt" ? "Criar Campanha" : "Create Campaign"}
                </Button>
                <a href="/pt/kadeh-ads/manual">
                  <Button 
                    variant="outline"
                    className="text-lg px-8 py-6 h-auto border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    {language === "pt" ? "📖 Passo a Passo" : "📖 Tutorial"}
                  </Button>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 overflow-hidden">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/IAvkBFlhnYjimXcs.png"
                alt="Casal feliz no supermercado com carrinho de compras"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cost Simulator Section */}
      <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Promotional Warning Banner */}
          <div className="mb-12 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-lg p-6 md:p-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-2">
                  {language === "pt" ? "Promoção Especial de Testes" : "Special Testing Promotion"}
                </h3>
                <p className="text-amber-800 mb-3 text-base md:text-lg">
                  {language === "pt"
                    ? "Os valores apresentados no simulador incluem um desconto promocional de 75% válido durante o período de testes."
                    : "The values shown in the simulator include a promotional discount of 75% valid during the testing period."}
                </p>
                <p className="text-amber-800 font-semibold text-base md:text-lg">
                  {language === "pt"
                    ? "Após o término do período de testes, os investimentos seguirão a tabela de preços normal."
                    : "After the testing period ends, investments will follow the standard pricing table."}
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {language === "pt" ? "Simulador de Custos Detalhado" : "Detailed Cost Simulator"}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Image on the left */}
            <div className="hidden md:flex justify-center">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/zZAicZSDGzqokqHa.png"
                alt="Kadeh Ads - Receba por Ads vendidos"
                className="w-full max-w-sm h-auto object-contain rounded-lg"
              />
            </div>
            {/* Simulator on the right */}
            <div>
              <KadehAdsCostSimulator />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {language === "pt" ? "Por que usar Kadeh Ads?" : "Why use Kadeh Ads?"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {language === "pt" ? "Como Funciona" : "How It Works"}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {language === "pt" 
              ? "Pronto para aumentar suas vendas?" 
              : "Ready to increase your sales?"}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {language === "pt"
              ? "Crie sua primeira campanha agora e veja resultados em tempo real"
              : "Create your first campaign now and see real-time results"}
          </p>
          <Button 
            onClick={() => setShowFormModal(true)}
            className="bg-white hover:bg-gray-100 text-blue-600 text-lg px-8 py-6 h-auto font-semibold"
          >
            {language === "pt" ? "Começar Agora" : "Get Started Now"}
          </Button>
        </div>
      </section>

      {/* Modal for Form */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === "pt" ? "Criar Campanha" : "Create Campaign"}
              </h2>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <KadehAdsCampaignForm />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

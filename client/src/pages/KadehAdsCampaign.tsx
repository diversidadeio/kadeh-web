import { KadehAdsCampaignForm } from "@/components/KadehAdsCampaignForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { Zap, BarChart3, TrendingUp, Target, Users, DollarSign } from "lucide-react";
import { KadehAdsCostSimulator } from "@/components/KadehAdsCostSimulator";

export default function KadehAdsCampaignPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedStores, setSelectedStores] = useState<string>("");
  const { language } = useLanguage();
  const t = translations[language];

  // Pricing configuration
  const pricingByDuration: Record<string, number> = {
    "1day": 100,
    "3days": 250,
    "7days": 500,
    "14days": 800,
  };

  const multiplierByStores: Record<string, number> = {
    "1-5": 1.0,
    "6-20": 1.5,
    "21-50": 2.0,
    "50+": 2.5,
  };

  const durationOptions = [
    { value: "1day", label: language === "pt" ? "1 dia" : "1 day", price: 100 },
    { value: "3days", label: language === "pt" ? "3 dias" : "3 days", price: 250 },
    { value: "7days", label: language === "pt" ? "7 dias" : "7 days", price: 500 },
    { value: "14days", label: language === "pt" ? "14 dias" : "14 days", price: 800 },
  ];

  const storeOptions = [
    { value: "1-5", label: language === "pt" ? "1-5 lojas" : "1-5 stores", multiplier: 1.0 },
    { value: "6-20", label: language === "pt" ? "6-20 lojas" : "6-20 stores", multiplier: 1.5 },
    { value: "21-50", label: language === "pt" ? "21-50 lojas" : "21-50 stores", multiplier: 2.0 },
    { value: "50+", label: language === "pt" ? "50+ lojas" : "50+ stores", multiplier: 2.5 },
  ];

  const calculatedPrice = useMemo(() => {
    if (!selectedDuration || !selectedStores) return null;
    
    const basePrice = pricingByDuration[selectedDuration] || 0;
    const multiplier = multiplierByStores[selectedStores] || 1;
    const totalPrice = basePrice * multiplier;
    
    return {
      basePrice,
      multiplier,
      totalPrice,
      durationLabel: durationOptions.find(d => d.value === selectedDuration)?.label || "",
      storesLabel: storeOptions.find(s => s.value === selectedStores)?.label || "",
    };
  }, [selectedDuration, selectedStores]);

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
              <Button 
                onClick={() => setShowFormModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto"
              >
                {language === "pt" ? "Criar Campanha" : "Create Campaign"}
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="aspect-video bg-gradient-to-br from-blue-200 to-indigo-300 rounded-lg flex items-center justify-center">
                <Zap className="w-24 h-24 text-blue-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {language === "pt" ? "Calcule seu Investimento" : "Calculate Your Investment"}
          </h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            {/* Duration Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                {language === "pt" ? "Duração da Campanha" : "Campaign Duration"}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDuration(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedDuration === option.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">R$ {option.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Store Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                {language === "pt" ? "Quantidade de Lojas" : "Number of Stores"}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {storeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStores(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedStores === option.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">x{option.multiplier.toFixed(1)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Display */}
            {calculatedPrice && (
              <div className="border-t-2 pt-8 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">{language === "pt" ? "Preço Base" : "Base Price"}</p>
                    <p className="text-2xl font-bold text-gray-900">R$ {calculatedPrice.basePrice.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">{language === "pt" ? "Multiplicador" : "Multiplier"}</p>
                    <p className="text-2xl font-bold text-gray-900">x{calculatedPrice.multiplier.toFixed(1)}</p>
                  </div>
                  <div className="text-center bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">{language === "pt" ? "Valor Total" : "Total Value"}</p>
                    <p className="text-3xl font-bold text-blue-600">R$ {calculatedPrice.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    {language === "pt" ? "Resumo da Campanha" : "Campaign Summary"}
                  </p>
                  <p className="text-gray-900">
                    {calculatedPrice.durationLabel} • {calculatedPrice.storesLabel}
                  </p>
                </div>

                <Button 
                  onClick={() => setShowFormModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 h-auto font-semibold"
                >
                  {language === "pt" ? "Contratar Agora" : "Hire Now"}
                </Button>
              </div>
            )}

            {!calculatedPrice && (
              <div className="text-center py-8 text-gray-500">
                {language === "pt" 
                  ? "Selecione duração e quantidade de lojas para calcular o valor"
                  : "Select duration and number of stores to calculate the price"}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cost Simulator Section */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-200">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {language === "pt" ? "Simulador de Custos Detalhado" : "Detailed Cost Simulator"}
          </h2>
          <KadehAdsCostSimulator />
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

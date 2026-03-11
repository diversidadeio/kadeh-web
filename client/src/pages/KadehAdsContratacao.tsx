import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, BarChart3, Clock } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import AdPreview from "@/components/AdPreview";

const translations = {
  pt: {
    title: "Kadeh Ads - Planos e Preços",
    subtitle: "Impulsione seus produtos com publicidade inteligente no ponto de venda",
    heroTitle: "Invista em Publicidade Inteligente",
    heroSubtitle: "Escolha o plano ideal para sua empresa e comece a impulsionar seus produtos com anúncios contextualizados",
    adTypeTitle: "Tipo de Anúncio",
    adTypeDesc: "Selecione o tipo de anúncio que melhor representa sua promoção",
    adType1: "Desconto Especial",
    adType2: "Leve 3 Pague 2",
    adType3: "Produtos com Poucas Unidades",
    adType4: "Leve Mais por Menos",
    adTextLabel: "Texto do Anúncio",
    adTextPlaceholder: "Digite o texto do seu anúncio (máximo 140 caracteres)",
    adTextCounter: "caracteres",
    benefit1: "Anúncios Contextualizados",
    benefit1Desc: "Exiba anúncios relevantes baseados na busca do cliente",
    benefit2: "Descontos Progressivos",
    benefit2Desc: "Até 40% de desconto por volume de produtos",
    benefit3: "Ativação Rápida",
    benefit3Desc: "Campanha ativa em até 24 horas",
    pricingTitle: "Calcule seu Investimento",
    pricingSubtitle: "Selecione a quantidade de produtos a anunciar e veja o preço progressivo",
    numProducts: "Número de Produtos",
    pricePerProduct: "Preço por Produto",
    totalInvestment: "Investimento Total",
    savings: "Economia",
    plan: "Plano",
    perImage: "Por Imagem",
    totalValue: "Valor Total",
    discount: "Desconto",
    contract: "Contratar",
    included: "O que está incluído em todos os planos",
    feature1: "Anúncios Contextualizados",
    feature1Desc: "Exiba seus produtos onde os clientes mais compram",
    feature2: "Analytics em Tempo Real",
    feature2Desc: "Acompanhe impressões, cliques e conversões",
    feature3: "Ativação Imediata",
    feature3Desc: "Sua campanha ativa em até 24 horas",
    feature4: "Suporte Dedicado",
    feature4Desc: "Equipe pronta para ajudar no sucesso da sua campanha",
    feature5: "Segmentação Inteligente",
    feature5Desc: "Anúncios aparecem para o público certo, no momento certo",
    feature6: "Relatórios Detalhados",
    feature6Desc: "Entenda o desempenho e ROI de cada campanha",
    cta: "Pronto para começar?",
    ctaDesc: "Selecione o plano que melhor se adapta ao seu volume de imagens e envie seu interesse. Nossa equipe entrará em contato em até 24 horas.",
    viewPlans: "Ver Planos e Preços",
    loginRequired: "Faça login para contratar Kadeh Ads",
    login: "Fazer Login",
  },
  en: {
    adTypeTitle: "Choose Your Ad Type",
    adTypeDesc: "Select the ad type and write your message",
    adType1: "1 - Special Discount",
    adType2: "2 - Buy 3 Pay 2",
    adType3: "3 - Low Stock Products",
    adType4: "4 - Buy More Pay Less",
    adTextLabel: "Ad Text",
    adTextPlaceholder: "Type your ad text (maximum 140 characters)...",
    adTextCounter: "characters",
    title: "Kadeh Ads - Plans and Prices",
    subtitle: "Boost your products with intelligent advertising at the point of sale",
    heroTitle: "Invest in Intelligent Advertising",
    heroSubtitle: "Choose the ideal plan for your company and start boosting your products with contextualized ads",
    adTypeDesc: "Select the ad type that best represents your promotion",
    adType1: "Special Discount",
    adType2: "Buy 3 Pay 2",
    adType3: "Low Stock Products",
    adType4: "Buy More Pay Less",
    adTextLabel: "Ad Text",
    adTextPlaceholder: "Enter your ad text (maximum 140 characters)",
    adTextCounter: "characters",
    benefit1: "Contextualized Ads",
    benefit1Desc: "Display relevant ads based on customer search",
    benefit2: "Progressive Discounts",
    benefit2Desc: "Up to 40% discount per image volume",
    benefit3: "Quick Activation",
    benefit3Desc: "Campaign active within 24 hours",
    pricingTitle: "Investment Scale for Kadeh Ads",
    pricingSubtitle: "Price per image — the larger the volume, the greater the discount",
    plan: "Plan",
    perImage: "Per Image",
    totalValue: "Total Value",
    discount: "Discount",
    contract: "Contract",
    included: "What's included in all plans",
    feature1: "Contextualized Ads",
    feature1Desc: "Display your products where customers buy the most",
    feature2: "Real-Time Analytics",
    feature2Desc: "Track impressions, clicks and conversions",
    feature3: "Immediate Activation",
    feature3Desc: "Your campaign active within 24 hours",
    feature4: "Dedicated Support",
    feature4Desc: "Team ready to help your campaign succeed",
    feature5: "Intelligent Segmentation",
    feature5Desc: "Ads appear to the right audience, at the right time",
    feature6: "Detailed Reports",
    feature6Desc: "Understand the performance and ROI of each campaign",
    cta: "Ready to get started?",
    ctaDesc: "Select the plan that best suits your image volume and submit your interest. Our team will contact you within 24 hours.",
    viewPlans: "View Plans and Pricing",
    loginRequired: "Log in to contract Kadeh Ads",
    login: "Log In",
  },
};

interface PricingPlan {
  id: string;
  name: string;
  minImages: number;
  maxImages: number;
  pricePerImage: number;
  totalValue: number;
  discount: number;
  badge?: string;
  note?: string;
}

interface ProductPricingTier {
  quantity: number;
  pricePerProduct: number;
  discount: number;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "avulso",
    name: "Avulso",
    minImages: 20,
    maxImages: 20,
    pricePerImage: 5.0,
    totalValue: 100.0,
    discount: 0,
    note: "Pacote com venda única, para testes",
  },
  {
    id: "pacote100",
    name: "Pacote de 100 imagens",
    minImages: 100,
    maxImages: 100,
    pricePerImage: 4.0,
    totalValue: 500.0,
    discount: 20,
  },
  {
    id: "pacote500",
    name: "Pacote de 101 a 500 imagens",
    minImages: 101,
    maxImages: 500,
    pricePerImage: 3.5,
    totalValue: 1750.0,
    discount: 30,
    badge: "Recomendado",
  },
  {
    id: "pacote999",
    name: "Pacote de 501 a 999 imagens",
    minImages: 501,
    maxImages: 999,
    pricePerImage: 3.0,
    totalValue: 3000.0,
    discount: 40,
    badge: "Mais Popular",
  },
  {
    id: "pacote1001",
    name: "Pacote acima de 1001 imagens",
    minImages: 1001,
    maxImages: 4999,
    pricePerImage: 2.5,
    totalValue: 12497.5,
    discount: 50,
    badge: "Melhor Valor",
  },
];

// Tabela de preços por quantidade de produtos
const productPricingTiers: ProductPricingTier[] = [
  { quantity: 1, pricePerProduct: 100, discount: 0 },
  { quantity: 3, pricePerProduct: 90, discount: 10 },
  { quantity: 5, pricePerProduct: 70, discount: 30 },
  { quantity: 10, pricePerProduct: 50, discount: 50 },
];

export default function KadehAdsContratacao() {
  const { isAuthenticated } = useAuth();
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [selectedAdType, setSelectedAdType] = useState<string>("desconto");
  const [adText, setAdText] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<number>(1);
  const t = translations[lang];

  // Calcular preço baseado na quantidade de produtos
  const calculatePrice = (quantity: number) => {
    let tier = productPricingTiers[0];
    for (const t of productPricingTiers) {
      if (quantity >= t.quantity) {
        tier = t;
      }
    }
    return tier;
  };

  const selectedTier = calculatePrice(selectedProducts);
  const totalInvestment = selectedProducts * selectedTier.pricePerProduct;
  const originalPrice = selectedProducts * 100;
  const savings = originalPrice - totalInvestment;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{t.loginRequired}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Você precisa estar autenticado para acessar os planos de contratação
              </p>
              <Button
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
                className="w-full"
              >
                {t.login}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Language Selector */}
      <div className="flex justify-end p-4">
        <div className="flex gap-2">
          <Button
            variant={lang === "pt" ? "default" : "outline"}
            size="sm"
            onClick={() => setLang("pt")}
          >
            PT
          </Button>
          <Button
            variant={lang === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLang("en")}
          >
            EN
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.heroTitle}</h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">{t.heroSubtitle}</p>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6 text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">{t.benefit1}</h3>
                <p className="text-slate-400 text-sm">{t.benefit1Desc}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6 text-center">
                <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">{t.benefit2}</h3>
                <p className="text-slate-400 text-sm">{t.benefit2Desc}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6 text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">{t.benefit3}</h3>
                <p className="text-slate-400 text-sm">{t.benefit3Desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ad Type Selection Section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.adTypeTitle}</h2>
            <p className="text-lg text-muted-foreground">{t.adTypeDesc}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Form */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Configurar Anúncio</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { id: "desconto", label: t.adType1 },
                  { id: "leve3pague2", label: t.adType2 },
                  { id: "poucasunidades", label: t.adType3 },
                  { id: "levemais", label: t.adType4 },
                ].map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition ${
                  selectedAdType === type.id
                    ? "border-blue-600 border-2 bg-blue-100"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelectedAdType(type.id)}
              >
                <CardContent className="pt-6 text-center">
                  <input
                    type="radio"
                    name="adType"
                    value={type.id}
                    checked={selectedAdType === type.id}
                    onChange={() => setSelectedAdType(type.id)}
                    className="mr-3"
                  />
                  <label className="font-semibold text-lg">{type.label}</label>
                </CardContent>
              </Card>
            ))}
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">{t.adTextLabel}</label>
                <textarea
                  value={adText}
                  onChange={(e) => {
                    if (e.target.value.length <= 140) {
                      setAdText(e.target.value);
                    }
                  }}
                  placeholder={t.adTextPlaceholder}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows={4}
                  maxLength={140}
                />
                <div className="text-right text-sm text-muted-foreground mt-2">
                  {adText.length}/140 {t.adTextCounter}
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex items-center justify-center bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <AdPreview
                adType={selectedAdType}
                adText={adText}
                productName="Seu Produto"
                lang={lang}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.pricingTitle}</h2>
            <p className="text-lg text-muted-foreground">{t.pricingSubtitle}</p>
          </div>

          {/* Product Quantity Selector and Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left: Quantity Selector */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{t.numProducts}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 3, 5, 10].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setSelectedProducts(qty)}
                        className={`p-4 rounded-lg border-2 transition font-semibold text-lg ${
                          selectedProducts === qty
                            ? "border-blue-600 bg-blue-100 text-blue-900"
                            : "border-gray-200 bg-white text-gray-900 hover:border-blue-300"
                        }`}
                      >
                        {qty} {qty === 1 ? "Produto" : "Produtos"}
                      </button>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ou digite uma quantidade:</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Price Summary */}
            <div>
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">{t.totalInvestment}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">{t.numProducts}:</span>
                      <span className="text-2xl font-bold">{selectedProducts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">{t.pricePerProduct}:</span>
                      <span className="text-2xl font-bold">R$ {selectedTier.pricePerProduct.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-blue-400 pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-100">Valor Original:</span>
                        <span className="line-through text-blue-200">R$ {originalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-3xl font-bold">
                        <span>{t.totalInvestment}:</span>
                        <span>R$ {totalInvestment.toFixed(2)}</span>
                      </div>
                    </div>
                    {savings > 0 && (
                      <div className="bg-green-500 bg-opacity-20 rounded-lg p-3 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-green-100">{t.savings}:</span>
                          <span className="font-bold text-lg">R$ {savings.toFixed(2)} ({selectedTier.discount}%)</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg py-6">
                    {t.contract}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold">{t.plan}</th>
                  <th className="px-6 py-4 text-center font-semibold">{t.perImage}</th>
                  <th className="px-6 py-4 text-center font-semibold">{t.totalValue}</th>
                  <th className="px-6 py-4 text-center font-semibold">{t.discount}</th>
                  <th className="px-6 py-4 text-center font-semibold">{t.contract}</th>
                </tr>
              </thead>
              <tbody>
                {pricingPlans.map((plan, index) => (
                  <tr
                    key={plan.id}
                    className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{plan.name}</p>
                          {plan.note && <p className="text-xs text-muted-foreground mt-1">{plan.note}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="font-semibold text-blue-600">R$ {plan.pricePerImage.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="font-semibold">R$ {plan.totalValue.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {plan.discount > 0 ? (
                        <div className="flex flex-col items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            -{plan.discount}%
                          </Badge>
                          {plan.badge && (
                            <Badge variant="default" className="bg-blue-600">
                              {plan.badge}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert(`Plano selecionado: ${plan.name}\nValor: R$ ${plan.totalValue.toFixed(2)}`);
                          // Aqui você redirecionaria para o checkout
                        }}
                      >
                        {t.contract}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            * Valores em reais. Para volumes acima de 5.000 imagens, entre em contato para uma proposta personalizada.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.included}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: t.feature1, desc: t.feature1Desc },
              { title: t.feature2, desc: t.feature2Desc },
              { title: t.feature3, desc: t.feature3Desc },
              { title: t.feature4, desc: t.feature4Desc },
              { title: t.feature5, desc: t.feature5Desc },
              { title: t.feature6, desc: t.feature6Desc },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.cta}</h2>
          <p className="text-lg text-blue-100 mb-8">{t.ctaDesc}</p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={() => {
              document.querySelector("table")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {t.viewPlans}
          </Button>
        </div>
      </section>
    </div>
  );
}

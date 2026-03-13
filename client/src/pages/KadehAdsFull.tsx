import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Zap, Users, TrendingUp, Target, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function KadehAdsFull() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  
  // Simulador de investimento - Versão com 4 variáveis completas
  const [duration, setDuration] = useState(7);
  const [stores, setStores] = useState(1.0);
  const [products, setProducts] = useState(1);
  const [customProducts, setCustomProducts] = useState("");

  const handleContactForm = () => {
    navigate("/contact");
  };

  // Preços base por duração
  const durationPrices: { [key: number]: number } = {
    1: 100,
    3: 250,
    7: 500,
    14: 900,
  };

  // Preço por produto com desconto progressivo
  const getProductPrice = (qty: number): number => {
    if (qty >= 10) return 50;
    if (qty >= 5) return 70;
    if (qty >= 3) return 90;
    return 100;
  };

  // Calcular valor total
  const selectedProducts = customProducts ? parseInt(customProducts) || 1 : products;
  const pricePerProduct = getProductPrice(selectedProducts);
  const durationPrice = durationPrices[duration] || 500;
  const totalValue = durationPrice * stores * selectedProducts;
  const savings = selectedProducts * 100 * duration * stores - totalValue;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Impacte o cliente no momento que mais importa
              </h1>
              <p className="text-xl text-blue-100">
                Kadeh Ads conecta seus anúncios com consumidores no ponto de venda, no exato momento da decisão de compra. Aumente vendas com publicidade contextualizada.
              </p>
              <div className="flex gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={handleContactForm}
                >
                  Começar Agora <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-blue-700"
                  onClick={handleContactForm}
                >
                  Saiba Mais
                </Button>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/RCUmLFKODhWZihQJ.jpg" 
                alt="Família em supermercado usando Kadeh Ads"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            {language === 'pt' ? 'Por que Kadeh Ads funciona' : 'Why Kadeh Ads Works'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">73%</div>
                <CardTitle className="text-lg">{language === 'pt' ? 'Influência do Mobile' : 'Mobile Influence'}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>
                  {language === 'pt'
                    ? '73% dos consumidores usam smartphone para auxiliar decisões de compra no ponto de venda'
                    : '73% of consumers use smartphones to assist purchase decisions at the point of sale'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">84%</div>
                <CardTitle className="text-lg">{language === 'pt' ? 'Compras por Impulso' : 'Impulse Purchases'}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>
                  {language === 'pt'
                    ? '84% dos consumidores fazem compras por impulso, especialmente quando expostos a recomendações relevantes'
                    : '84% of consumers make impulse purchases, especially when exposed to relevant recommendations'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
                <CardTitle className="text-lg">{language === 'pt' ? 'Incremento de Vendas' : 'Sales Increase'}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>
                  {language === 'pt'
                    ? 'Publicidade contextualizada no PDV pode aumentar vendas em até 40% em categorias relacionadas'
                    : 'Contextual advertising at POS can increase sales by up to 40% in related categories'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works for Customers Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            {language === 'pt' ? 'Experiência do Cliente' : 'Customer Experience'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg">{language === 'pt' ? '1. Busca' : '1. Search'}</h3>
              <p className="text-gray-600">
                {language === 'pt' ? 'Cliente busca um produto no app KADEH' : 'Customer searches for a product in the KADEH app'}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg">{language === 'pt' ? '2. Recomendação' : '2. Recommendation'}</h3>
              <p className="text-gray-600">
                {language === 'pt' ? 'Recebe anúncios de produtos correlacionados' : 'Receives ads for correlated products'}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg">{language === 'pt' ? '3. Conversão' : '3. Conversion'}</h3>
              <p className="text-gray-600">
                {language === 'pt' ? 'Compra produtos sugeridos no PDV' : 'Purchases suggested products at POS'}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg">{language === 'pt' ? '4. Resultado' : '4. Result'}</h3>
              <p className="text-gray-600">
                {language === 'pt' ? 'Ticket médio aumenta com cross-selling' : 'Average ticket increases with cross-selling'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertiser Flow Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Como funciona para Anunciantes
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Cadastro e Aprovação</h3>
                  <p className="text-gray-300">
                    Crie sua conta, envie informações da empresa e aguarde aprovação do administrador
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Crie seu Anúncio</h3>
                  <p className="text-gray-300">
                    Faça upload de imagens, defina categorias correlacionadas e escolha a duração (1, 3, 7 ou 14 dias)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Escolha Sua Segmentação</h3>
                  <p className="text-gray-300">
                    Selecione número de lojas/região e visualize sua posição de prioridade antes de pagar
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Pagamento Seguro</h3>
                  <p className="text-gray-300">
                    Pague via Stripe com segurança. Receba recibo e comece a anunciar imediatamente
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  5
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Acompanhe Resultados</h3>
                  <p className="text-gray-300">
                    Dashboard com analytics em tempo real: impressões, cliques e conversões
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Calculator - All 4 Variables */}
            <div className="bg-white rounded-lg p-8 text-gray-900 space-y-4 overflow-y-auto max-h-full">
              <h3 className="text-2xl font-bold">Calcule seu Investimento - 4 Variáveis</h3>
              
              {/* Duration Selector */}
              <div>
                <label className="block text-sm font-semibold mb-3">Duração da Campanha</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 3, 7, 14].map((days) => (
                    <button
                      key={days}
                      onClick={() => setDuration(days)}
                      className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                        duration === days
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {days} {days === 1 ? 'dia' : 'dias'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stores Selector */}
              <div>
                <label className="block text-sm font-semibold mb-3">Quantidade de Lojas</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '1-5 lojas', value: 1.0 },
                    { label: '6-20 lojas', value: 1.5 },
                    { label: '21-50 lojas', value: 2.0 },
                    { label: '50+ lojas', value: 2.5 },
                  ].map((store) => (
                    <button
                      key={store.value}
                      onClick={() => setStores(store.value)}
                      className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                        stores === store.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {store.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Selector */}
              <div>
                <label className="block text-sm font-semibold mb-3">Quantidade de Produtos Anunciados (1, 3, 5, 10+)</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[1, 3, 5, 10].map((prod) => (
                    <button
                      key={prod}
                      onClick={() => {
                        setProducts(prod);
                        setCustomProducts("");
                      }}
                      className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                        products === prod && !customProducts
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {prod} {prod === 1 ? 'produto' : 'produtos'}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  value={customProducts}
                  onChange={(e) => {
                    setCustomProducts(e.target.value);
                    if (e.target.value) setProducts(1);
                  }}
                  placeholder="Ou digite uma quantidade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Price Breakdown */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preço por Produto:</span>
                  <span className="font-semibold">R$ {pricePerProduct.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duração ({duration} dias):</span>
                  <span className="font-semibold">R$ {durationPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Multiplicador Lojas:</span>
                  <span className="font-semibold">x {stores.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quantidade Produtos:</span>
                  <span className="font-semibold">{selectedProducts}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Investimento Total:</span>
                  <span className="text-blue-600">R$ {totalValue.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="text-sm text-green-600 font-semibold">
                    Economia: R$ {savings.toFixed(2)}
                  </div>
                )}
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleContactForm}>
                Começar a Anunciar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Recursos Principais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Segmentação por IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Recomendações inteligentes de categorias correlacionadas (queijos + vinhos, sabão + amaciante, etc.)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Pausa com Aviso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pause seus anúncios com 24 horas de aviso prévio. Flexibilidade total para sua campanha
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Analytics em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acompanhe impressões, cliques e conversões com dashboard completo e relatórios detalhados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Priorização Transparente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Veja sua posição de prioridade antes de confirmar o pagamento. Ordem de contratação (FIFO)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Aprovação Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Processo de aprovação seguro e transparente. Receba feedback sobre sua aplicação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Aumento de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Anúncios contextualizados aumentam ticket médio com cross-selling e upselling
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">
            Pronto para impactar seus clientes?
          </h2>
          <p className="text-xl text-blue-100">
            Comece a anunciar hoje e veja o aumento nas suas vendas no ponto de venda
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={handleContactForm}
          >
            Acessar Kadeh Ads <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

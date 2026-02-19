import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import AdsPDVSection from "@/components/AdsPDVSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Zap, Users, TrendingUp, Target, Clock, Home } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function KadehAdsFull() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { language } = useLanguage();

  const handleContactForm = () => {
    navigate("/contact");
  };

  const handleStartAdvertising = () => {
    navigate("/advertiser-portal?tab=create");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
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

            <div className="bg-white rounded-lg p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6">Tabela de Preços</h3>
              
              <div className="space-y-4 mb-6">
                <div className="border-b pb-4">
                  <h4 className="font-bold mb-3">Por Duração</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1 dia</span>
                      <span className="font-semibold">R$ 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3 dias</span>
                      <span className="font-semibold">R$ 250</span>
                    </div>
                    <div className="flex justify-between">
                      <span>7 dias</span>
                      <span className="font-semibold">R$ 500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>14 dias</span>
                      <span className="font-semibold">R$ 900</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Multiplicador por Lojas/Região</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1-5 lojas</span>
                      <span className="font-semibold">x 1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>6-20 lojas</span>
                      <span className="font-semibold">x 1.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>21-50 lojas</span>
                      <span className="font-semibold">x 2.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>50+ lojas</span>
                      <span className="font-semibold">x 2.5</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-6">
                Exemplo: 7 dias × 10 lojas = R$ 500 × 1.5 = R$ 750
              </p>

              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleStartAdvertising}>
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

      {/* Ads no PDV Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <AdsPDVSection language={language} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
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
      <Footer />
    </div>
  );
}

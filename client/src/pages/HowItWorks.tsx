/**
 * How It Works Page — Kadeh
 * Design: Tech-Forward Minimalism
 * Shows: Consumer experience, Retail advantages, and Onboarding flows
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import {
  Smartphone,
  Store,
  BarChart3,
  Zap,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Download,
  FileText,
  Handshake,
  Lightbulb,
  Layers,
} from "lucide-react";

export default function HowItWorks() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-foreground">
            Como Funciona <span className="text-orange-600">Kadeh</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma única e completa que transforma a experiência de compra para consumidores 
            e oferece inteligência estratégica para negócios
          </p>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <img
            src="/images/kadeh-app-users.png"
            alt="Kadeh App Users"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
      </section>

      {/* For Consumers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground flex items-center gap-3">
              <Smartphone className="w-10 h-10 text-orange-600" />
              Para o Consumidor
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Kadeh é uma ferramenta que simplifica sua experiência de compra e deslocamento em áreas internas. 
              Agentes de IA auxiliam sua jornada, garantindo que as rotas sejam as melhores possíveis.
            </p>
          </div>

          {/* Consumer Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <Zap className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Experiência Simplificada</h3>
              <p className="text-muted-foreground">
                Navegação intuitiva que qualquer pessoa entende. Encontre produtos, serviços e áreas essenciais sem fricção.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <Lightbulb className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">IA Inteligente</h3>
              <p className="text-muted-foreground">
                Recomendações personalizadas de produtos complementares, substitutos e melhor rota de compra em tempo real.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <MapPin className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Rotas Otimizadas</h3>
              <p className="text-muted-foreground">
                Agentes de IA garantem que você sempre tenha a melhor rota, economizando tempo e tornando a compra mais eficiente.
              </p>
            </div>
          </div>

          {/* Consumer Onboarding Flow */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-12 rounded-lg border border-orange-200">
            <h3 className="text-2xl font-bold mb-8 text-foreground">Como Começar</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h4 className="font-bold mb-2">Download APP</h4>
                <p className="text-sm text-muted-foreground">
                  Apple Store ou Google Play
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h4 className="font-bold mb-2">Escolha Versão</h4>
                <p className="text-sm text-muted-foreground">
                  Shopping, Varejo, Saúde, Eventos, Localiza
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h4 className="font-bold mb-2">Selecione Local</h4>
                <p className="text-sm text-muted-foreground">
                  Escolha onde deseja ir e receba apoio
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
              <h4 className="font-bold mb-4">Versões Disponíveis:</h4>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Shopping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Varejo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Saúde</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Eventos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Localiza</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Retail Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground flex items-center gap-3">
              <Store className="w-10 h-10 text-blue-600" />
              Para o Varejo
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Kadeh oferece uma série de vantagens estratégicas que transformam a operação e aumentam a lucratividade.
            </p>
          </div>

          {/* Retail Advantages */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <Layers className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Smart Layout</h3>
              <p className="text-muted-foreground">
                Gerenciamento inteligente de categorias com recomendações de frentes, posicionamento e redimensionamento de gôndolas baseado em dados.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Intelligence</h3>
              <p className="text-muted-foreground">
                Intenção de compra em tempo real com relatórios on-time de buscas por categorias, segmentos e produtos em diferentes formatos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <CheckCircle className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Picking Eficiente</h3>
              <p className="text-muted-foreground">
                Picking otimizado para e-commerce e grandes plataformas (Rappi, iFood, Shopee) com rotas inteligentes e validação em tempo real.
              </p>
            </div>
          </div>

          {/* Retail Onboarding Flow */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-lg border border-blue-200">
            <h3 className="text-2xl font-bold mb-8 text-foreground">Como Começar</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h4 className="font-bold mb-2">Contato</h4>
                <p className="text-sm text-muted-foreground">
                  Entre em contato com nosso time
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h4 className="font-bold mb-2">Acordo de Uso</h4>
                <p className="text-sm text-muted-foreground">
                  Firme acordo de uso da ferramenta
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h4 className="font-bold mb-2">Envio de Dados</h4>
                <p className="text-sm text-muted-foreground">
                  Compartilhe planta e dados do local
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">4</div>
                <h4 className="font-bold mb-2">Receba Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Informações estratégicas em tempo real
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For All - Analytics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-purple-600" />
              Para Todos os Tipos de Kadeh
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Uma ferramenta única e completa com relatórios avançados e visualizações de dados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <FileText className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Relatórios de Experiência</h3>
              <p className="text-muted-foreground mb-4">
                Análise completa da jornada do usuário, padrões de navegação, pontos de fricção e oportunidades de melhoria.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Jornada do usuário em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Padrões de comportamento
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Análise de conversão
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <Lightbulb className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Heat Maps</h3>
              <p className="text-muted-foreground mb-4">
                Visualização de áreas mais visitadas, pontos de congestionamento e oportunidades de otimização de layout.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Mapa de calor de fluxo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Áreas de alta concentração
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Otimização de espaço
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Kadeh Localiza & Eventos Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground flex items-center gap-3">
              <Handshake className="w-10 h-10 text-teal-600" />
              Kadeh Localiza & Kadeh Eventos
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Processo similar com foco em parceria comercial e experiência do consumidor.
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-12 rounded-lg border border-teal-200">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h4 className="font-bold mb-2">Contato</h4>
                <p className="text-sm text-muted-foreground">
                  Inicie conversas com nosso time comercial
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h4 className="font-bold mb-2">Parceria</h4>
                <p className="text-sm text-muted-foreground">
                  Feche a parceria comercial
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h4 className="font-bold mb-2">Envio de Planta</h4>
                <p className="text-sm text-muted-foreground">
                  Compartilhe planta e detalhamento
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">4</div>
                <h4 className="font-bold mb-2">Melhor Experiência</h4>
                <p className="text-sm text-muted-foreground">
                  Usufrua de experiência aprimorada
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
              <h4 className="font-bold mb-4">Aplicações:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-teal-600 mb-2">Kadeh Localiza</h5>
                  <p className="text-sm text-muted-foreground">
                    Perfeito para aeroportos, rodoviárias e serviços públicos. Rotas certeiras, menos filas e redução de necessidade de orientação humana.
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-teal-600 mb-2">Kadeh Eventos</h5>
                  <p className="text-sm text-muted-foreground">
                    Ideal para feiras, conferências e eventos. Clientes encontram stands, palestras e recebem sugestões personalizadas via IA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Summary */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-foreground">
            Por Que Escolher Kadeh?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2">Fácil de Usar</h3>
              <p className="text-sm text-muted-foreground">
                Interface intuitiva que qualquer pessoa consegue usar sem treinamento
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2">Implementação Rápida</h3>
              <p className="text-sm text-muted-foreground">
                Ative em dias, não em meses. Plug and play com dados existentes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2">Resultados Comprovados</h3>
              <p className="text-sm text-muted-foreground">
                +35% em vendas, +50% em retenção, +60% em satisfação
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2">Suporte Completo</h3>
              <p className="text-sm text-muted-foreground">
                Time dedicado para implementação, treinamento e otimização contínua
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

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
            {language === 'pt' ? 'Como Funciona' : 'How It Works'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'pt'
              ? 'Uma plataforma única e completa que transforma a experiência de compra para consumidores e oferece inteligência estratégica para negócios'
              : 'A unique and complete platform that transforms the shopping experience for consumers and offers strategic intelligence for businesses'}
          </p>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <img
            src="/images/telaapp.png"
            alt={language === 'pt' ? 'Aplicativo Kadeh' : 'Kadeh App'}
            className="w-full h-auto max-h-[600px] object-contain drop-shadow-2xl scale-110 sm:scale-100"
          />
        </div>
      </section>

      {/* For Consumers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground flex items-center gap-3">
              <Smartphone className="w-10 h-10 text-orange-600" />
              {language === 'pt' ? 'Para o Consumidor' : 'For Consumers'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {language === 'pt' 
                ? 'Kadeh é uma ferramenta que simplifica sua experiência de compra e deslocamento em áreas internas. Agentes de IA auxiliam sua jornada, garantindo que as rotas sejam as melhores possíveis.'
                : 'Kadeh is a tool that simplifies your shopping experience and movement in indoor areas. AI agents assist your journey, ensuring that routes are always the best possible.'}
            </p>
          </div>

          {/* Consumer Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <Zap className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">
                {language === 'pt' ? 'Experiência Simplificada' : 'Simplified Experience'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'pt'
                  ? 'Navegação intuitiva que qualquer pessoa entende. Encontre produtos, serviços e áreas essenciais sem fricção.'
                  : 'Intuitive navigation that anyone understands. Find products, services and essential areas without friction.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <Lightbulb className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">
                {language === 'pt' ? 'IA Inteligente' : 'Intelligent AI'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'pt'
                  ? 'Recomendações personalizadas de produtos complementares, substitutos e melhor rota de compra em tempo real.'
                  : 'Personalized recommendations for complementary products, substitutes and best purchase route in real-time.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <MapPin className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">
                {language === 'pt' ? 'Rotas Otimizadas' : 'Optimized Routes'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'pt'
                  ? 'Agentes de IA garantem que você sempre tenha a melhor rota, economizando tempo e tornando a compra mais eficiente.'
                  : 'AI agents ensure you always have the best route, saving time and making shopping more efficient.'}
              </p>
            </div>
          </div>

          {/* Consumer Onboarding Flow */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-12 rounded-lg border border-orange-200">
            <h3 className="text-2xl font-bold mb-8 text-foreground">
              {language === 'pt' ? 'Como Começar' : 'Getting Started'}
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h4 className="font-bold mb-2">
                  {language === 'pt' ? 'Download APP' : 'Download App'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt' ? 'Apple Store ou Google Play' : 'Apple Store or Google Play'}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h4 className="font-bold mb-2">
                  {language === 'pt' ? 'Escolha Versão' : 'Choose Version'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt' 
                    ? 'Shopping, Varejo, Saúde, Eventos, Localiza'
                    : 'Shopping, Retail, Healthcare, Events, Localization'}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h4 className="font-bold mb-2">
                  {language === 'pt' ? 'Selecione Local' : 'Select Location'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? 'Escolha onde deseja ir e receba apoio'
                    : 'Choose where you want to go and receive support'}
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
              <h4 className="font-bold mb-4">
                {language === 'pt' ? 'Versões Disponíveis:' : 'Available Versions:'}
              </h4>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Shopping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Retail</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Healthcare</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Kadeh Localization</span>
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
              {language === 'pt' ? 'Para o Varejo' : 'For Retail'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {language === 'pt'
                ? 'Kadeh oferece uma série de vantagens estratégicas que transformam a operação e aumentam a lucratividade.'
                : 'Kadeh offers a series of strategic advantages that transform operations and increase profitability.'}
            </p>
          </div>

          {/* Retail Advantages */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <Layers className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Smart Layout</h3>
              <p className="text-muted-foreground">
                {language === 'pt'
                  ? 'Gerenciamento inteligente de categorias com recomendações de frentes, posicionamento e redimensionamento de gôndolas baseado em dados.'
                  : 'Intelligent category management with recommendations for shelf positioning and gondola resizing based on data.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Intelligence</h3>
              <p className="text-muted-foreground">
                {language === 'pt'
                  ? 'Intenção de compra em tempo real com relatórios on-time de buscas por categorias, segmentos e produtos em diferentes formatos.'
                  : 'Real-time purchase intent with on-time reports of searches by categories, segments and products in different formats.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
              <CheckCircle className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">
                {language === 'pt' ? 'Picking Eficiente' : 'Efficient Picking'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'pt'
                  ? 'Picking otimizado para e-commerce e grandes plataformas (Rappi, iFood, Shopee) com rotas inteligentes e validação em tempo real.'
                  : 'Optimized picking for e-commerce and major platforms (Rappi, iFood, Shopee) with intelligent routes and real-time validation.'}
              </p>
            </div>
          </div>

          {/* Retail Onboarding Flow */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-lg border border-blue-200">
            <h3 className="text-2xl font-bold mb-8 text-foreground">
              {language === 'pt' ? 'Como Começar' : 'Getting Started'}
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h4 className="font-bold mb-2">
                  {language === 'pt' ? 'Contato' : 'Contact'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? 'Entre em contato com nosso time'
                    : 'Get in touch with our team'}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h4 className="font-bold mb-2">
                  {language === 'pt' ? 'Acordo de Uso' : 'Usage Agreement'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? 'Firme acordo de uso da ferramenta'
                    : 'Sign usage agreement for the tool'}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h4 className="font-bold mb-2">
                  {language === 'pt' ? 'Envio de Dados' : 'Data Submission'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? 'Compartilhe planta e dados do local'
                    : 'Share floor plan and location data'}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">4</div>
                <h4 className="font-bold mb-2">
                  {language === 'pt' ? 'Receba Insights' : 'Receive Insights'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? 'Informações estratégicas em tempo real'
                    : 'Strategic information in real-time'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-purple-600" />
              {language === 'pt' ? 'Para Todos os Tipos de Kadeh' : 'For All Kadeh Types'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {language === 'pt'
                ? 'Uma ferramenta única e completa com relatórios avançados e visualizações de dados.'
                : 'A unique and complete tool with advanced reports and data visualizations.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">
                {language === 'pt' ? 'Relatórios de Experiência' : 'Experience Reports'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'pt'
                  ? 'Análise completa da jornada do usuário, padrões de navegação, pontos de fricção e oportunidades de melhoria.'
                  : 'Complete analysis of user journey, navigation patterns, friction points and improvement opportunities.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    {language === 'pt' ? 'Jornada do usuário em tempo real' : 'Real-time user journey'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    {language === 'pt' ? 'Padrões de comportamento' : 'Behavior patterns'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    {language === 'pt' ? 'Análise de conversão' : 'Conversion analysis'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <MapPin className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">
                {language === 'pt' ? 'Heat Maps' : 'Heat Maps'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'pt'
                  ? 'Visualização de áreas mais visitadas, pontos de congestionamento e oportunidades de otimização de layout.'
                  : 'Visualization of most visited areas, congestion points and layout optimization opportunities.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    {language === 'pt' ? 'Mapa de calor de fluxo' : 'Flow heat map'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    {language === 'pt' ? 'Áreas de alta concentração' : 'High concentration areas'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    {language === 'pt' ? 'Otimização de espaço' : 'Space optimization'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/**
 * Data Intelligence Page — Kadeh Intelligence
 * Design: Tech-Forward Minimalism
 * SEO: Optimized for retail analytics, customer insights, data intelligence keywords
 */

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import DataIntelligenceDashboard from "@/components/DataIntelligenceDashboard";
import MarginAnalysisByStore from "@/components/MarginAnalysisByStore";
import CategoryPerformanceDashboard from "@/pages/CategoryPerformanceDashboard";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Zap,
  Eye,
  MapPin,
  Target,
  Calendar,
  ShoppingCart,
} from "lucide-react";

export default function DataIntelligence() {
  const { language } = useLanguage();
  const t = translations[language];
  const features = [
    {
      title: language === 'pt' ? "Intenção de Compra em Tempo Real" : "Real-time Purchase Intent",
      description: language === 'pt'
        ? "Identifique clientes com alta intenção de compra baseado em padrões de navegação e interação com produtos."
        : "Identify customers with high purchase intent based on navigation patterns and product interaction.",
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Padrões de Busca de Produtos" : "Product Search Patterns",
      description: language === 'pt'
        ? "Analise quais produtos são mais buscados, em qual ordem e por quais categorias os clientes navegam."
        : "Analyze which products are most searched, in what order, and which categories customers navigate.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Análise por Categoria" : "Category Analysis",
      description: language === 'pt'
        ? "Número de itens buscados por categoria, quantidade de buscas e profundidade de navegação."
        : "Number of items searched by category, search volume and navigation depth.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Preferências de Marca" : "Brand Preferences",
      description: language === 'pt'
        ? "Identifique quais marcas os clientes buscam mais, tendências de marca e preferências por tipo de produto."
        : "Identify which brands customers search most, brand trends and product type preferences.",
      icon: <Eye className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Análise Temporal" : "Temporal Analysis",
      description: language === 'pt'
        ? "Dias da semana e do mês com maior utilização, horários de pico e padrões sazonais de busca."
        : "Days and times with highest usage, peak hours and seasonal search patterns.",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Heat Map de Navegação" : "Navigation Heat Map",
      description: language === 'pt'
        ? "Visualize o mapa de calor da loja mostrando onde os clientes navegam mais e quais áreas recebem menos atenção."
        : "Visualize the store heat map showing where customers navigate most and which areas receive less attention.",
      icon: <MapPin className="w-6 h-6" />,
    },
  ];

  const benefits = [
    {
      title: language === 'pt' ? "Decisões Baseadas em Dados Reais" : "Data-Driven Decisions",
      description: language === 'pt'
        ? "Elimine suposições com dados on-time de comportamento real dos clientes na sua loja."
        : "Eliminate guesswork with real-time data on actual customer behavior in your store.",
    },
    {
      title: language === 'pt' ? "Otimização de Layout" : "Layout Optimization",
      description: language === 'pt'
        ? "Use heat maps para reposicionar produtos e categorias onde os clientes realmente navegam."
        : "Use heat maps to reposition products and categories where customers actually navigate.",
    },
    {
      title: language === 'pt' ? "Aumento de Conversão" : "Conversion Increase",
      description: language === 'pt'
        ? "Identifique clientes com alta intenção de compra e ofereça recomendações personalizadas em tempo real."
        : "Identify high-intent customers and offer personalized recommendations in real-time.",
    },
    {
      title: language === 'pt' ? "Gestão de Estoque Inteligente" : "Smart Inventory Management",
      description: language === 'pt'
        ? "Saiba quais produtos são mais buscados e ajuste estoque conforme demanda real de navegação."
        : "Know which products are most searched and adjust inventory based on real navigation demand.",
    },
    {
      title: language === 'pt' ? "Personalização de Ofertas" : "Offer Personalization",
      description: language === 'pt'
        ? "Recomende ofertas baseadas em padrões de busca e preferências individuais dos clientes."
        : "Recommend offers based on search patterns and individual customer preferences.",
    },
    {
      title: language === 'pt' ? "Análise Competitiva" : "Competitive Analysis",
      description: language === 'pt'
        ? "Compare preferências de marca e identifique oportunidades de ganho de market share."
        : "Compare brand preferences and identify market share gain opportunities.",
    },
  ];

  const reportTypes = [
    {
      title: language === 'pt' ? "Dashboard On-Time" : "Real-time Dashboard",
      description: language === 'pt'
        ? "Visualização em tempo real de todas as métricas de comportamento dos clientes na loja."
        : "Real-time visualization of all customer behavior metrics in the store.",
      metrics: language === 'pt' 
        ? ["Clientes ativos", "Buscas em tempo real", "Intenção de compra", "Heat map live"]
        : ["Active customers", "Real-time searches", "Purchase intent", "Live heat map"],
    },
    {
      title: language === 'pt' ? "Relatório de Intenção de Compra" : "Purchase Intent Report",
      description: language === 'pt'
        ? "Identifique clientes com alta probabilidade de compra baseado em padrões de interação."
        : "Identify customers with high purchase probability based on interaction patterns.",
      metrics: language === 'pt'
        ? ["Score de intenção", "Produtos visualizados", "Tempo de permanência", "Ações tomadas"]
        : ["Intent score", "Products viewed", "Dwell time", "Actions taken"],
    },
    {
      title: language === 'pt' ? "Análise de Padrões de Busca" : "Search Pattern Analysis",
      description: language === 'pt'
        ? "Entenda como os clientes buscam produtos e quais são os caminhos mais comuns de navegação."
        : "Understand how customers search for products and what are the most common navigation paths.",
      metrics: language === 'pt'
        ? ["Sequência de busca", "Categorias visitadas", "Produtos mais vistos", "Tempo por categoria"]
        : ["Search sequence", "Categories visited", "Most viewed products", "Time per category"],
    },
    {
      title: language === 'pt' ? "Relatório de Categorias" : "Category Report",
      description: language === 'pt'
        ? "Número de itens buscados por categoria, quantidade de buscas e profundidade de navegação."
        : "Number of items searched by category, search volume and navigation depth.",
      metrics: language === 'pt'
        ? ["Itens por categoria", "Buscas por categoria", "Profundidade", "Taxa de conversão"]
        : ["Items per category", "Searches per category", "Depth", "Conversion rate"],
    },
    {
      title: language === 'pt' ? "Análise de Marcas" : "Brand Analysis",
      description: language === 'pt'
        ? "Quantidade de buscas por tipo de produto e marca, preferências e tendências."
        : "Number of searches by product type and brand, preferences and trends.",
      metrics: language === 'pt'
        ? ["Buscas por marca", "Buscas por tipo", "Preferência relativa", "Tendências"]
        : ["Searches by brand", "Searches by type", "Relative preference", "Trends"],
    },
    {
      title: language === 'pt' ? "Análise Temporal" : "Temporal Analysis",
      description: language === 'pt'
        ? "Dias e horários de maior utilização, padrões semanais, mensais e sazonais."
        : "Days and times of highest usage, weekly, monthly and seasonal patterns.",
      metrics: language === 'pt'
        ? ["Picos horários", "Dias de maior tráfego", "Padrões semanais", "Sazonalidade"]
        : ["Peak hours", "Highest traffic days", "Weekly patterns", "Seasonality"],
    },
  ];

  const heatmapBenefits = [
    {
      title: language === 'pt' ? "Visualizar Fluxo de Clientes" : "Visualize Customer Flow",
      description: language === 'pt'
        ? "Veja exatamente por onde os clientes navegam na loja e quais áreas recebem mais atenção."
        : "See exactly where customers navigate in the store and which areas receive the most attention.",
    },
    {
      title: language === 'pt' ? "Identificar Zonas Mortas" : "Identify Dead Zones",
      description: language === 'pt'
        ? "Descubra áreas da loja que recebem pouca atenção e otimize o layout para aumentar visibilidade."
        : "Discover store areas that receive little attention and optimize layout to increase visibility.",
    },
    {
      title: language === 'pt' ? "Otimizar Posicionamento de Produtos" : "Optimize Product Positioning",
      description: language === 'pt'
        ? "Coloque produtos de alta margem em áreas de alto tráfego identificadas no heat map."
        : "Place high-margin products in high-traffic areas identified in the heat map.",
    },
    {
      title: language === 'pt' ? "Melhorar Experiência de Navegação" : "Improve Navigation Experience",
      description: language === 'pt'
        ? "Entenda a jornada do cliente e remova barreiras que impedem acesso a categorias importantes."
        : "Understand the customer journey and remove barriers preventing access to important categories.",
    },
  ];

  const aiRecommendations = [
    {
      title: language === 'pt' ? "Recomendações Personalizadas" : "Personalized Recommendations",
      description: language === 'pt'
        ? "O agente de IA sugere produtos baseado no histórico de busca e padrões de comportamento do cliente."
        : "AI agent suggests products based on search history and customer behavior patterns.",
    },
    {
      title: language === 'pt' ? "Ofertas Inteligentes" : "Smart Offers",
      description: language === 'pt'
        ? "Recomende ofertas que aumentem a probabilidade de compra baseado em intenção detectada."
        : "Recommend offers that increase purchase probability based on detected intent.",
    },
    {
      title: language === 'pt' ? "Cross-Selling e Up-Selling" : "Cross-Selling and Up-Selling",
      description: language === 'pt'
        ? "Sugira produtos complementares e versões premium baseado em padrões de compra similares."
        : "Suggest complementary products and premium versions based on similar purchase patterns.",
    },
    {
      title: language === 'pt' ? "Rastreamento de Cliques" : "Click Tracking",
      description: language === 'pt'
        ? "Monitore quais ofertas sugeridas os clientes clicam e ajuste recomendações em tempo real."
        : "Monitor which suggested offers customers click and adjust recommendations in real-time.",
    },
  ];

  const faqItems = [
    {
      question: language === 'pt' ? "Os dados são coletados em tempo real?" : "Is data collected in real-time?",
      answer: language === 'pt'
        ? "Sim. O Kadeh Intelligence coleta e processa dados em tempo real, permitindo decisões imediatas baseadas no comportamento atual dos clientes."
        : "Yes. Kadeh Intelligence collects and processes data in real-time, enabling immediate decisions based on current customer behavior.",
    },
    {
      question: language === 'pt' ? "Como funciona a detecção de intenção de compra?" : "How does purchase intent detection work?",
      answer: language === 'pt'
        ? "O sistema analisa padrões de navegação, tempo de permanência em categorias, visualizações de produtos e interações com ofertas para calcular um score de intenção de compra."
        : "The system analyzes navigation patterns, time spent in categories, product views and offer interactions to calculate a purchase intent score.",
    },
    {
      question: language === 'pt' ? "O heat map mostra movimento de clientes específicos?" : "Does the heat map show specific customer movement?",
      answer: language === 'pt'
        ? "O heat map é agregado e anônimo, mostrando padrões gerais de navegação sem identificar indivíduos, garantindo privacidade."
        : "The heat map is aggregated and anonymous, showing general navigation patterns without identifying individuals, ensuring privacy.",
    },
    {
      question: language === 'pt' ? "Posso exportar os relatórios?" : "Can I export the reports?",
      answer: language === 'pt'
        ? "Sim. Todos os relatórios podem ser exportados em PDF, Excel ou integrados com ferramentas de BI como Power BI e Tableau."
        : "Yes. All reports can be exported as PDF, Excel or integrated with BI tools like Power BI and Tableau.",
    },
    {
      question: language === 'pt' ? "Qual é a latência dos dados?" : "What is the data latency?",
      answer: language === 'pt'
        ? "Dados são processados com latência de menos de 1 segundo, permitindo análises e recomendações verdadeiramente em tempo real."
        : "Data is processed with less than 1 second latency, enabling truly real-time analysis and recommendations.",
    },
    {
      question: language === 'pt' ? "Como os dados são armazenados e protegidos?" : "How is data stored and protected?",
      answer: language === 'pt'
        ? "Todos os dados estão em conformidade com LGPD, criptografados em trânsito e em repouso, com backup automático e acesso controlado."
        : "All data complies with LGPD, encrypted in transit and at rest, with automatic backup and controlled access.",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <Hero
        title={language === 'pt'
          ? "Kadeh Intelligence: dados on-time sobre comportamento de clientes para decisões comerciais inteligentes."
          : "Kadeh Intelligence: real-time data on customer behavior for smart business decisions."}
        subtitle={language === 'pt'
          ? "Relatórios em tempo real de intenção de compra, padrões de busca, heat maps de navegação e análises detalhadas de categorias, marcas e horários de pico."
          : "Real-time reports on purchase intent, search patterns, navigation heat maps and detailed analysis of categories, brands and peak times."}
        primaryCTA={language === 'pt' ? "Solicitar demonstração" : "Request Demo"}
        secondaryCTA={language === 'pt' ? "Ver relatórios" : "View Reports"}
        imageUrl="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/GDnvMWkVAKEtiCUk.png"
        imageAlt={language === 'pt' ? "Inteligência de Dados - Dashboard Analytics" : "Data Intelligence - Analytics Dashboard"}
      />

      {/* Funcionalidades */}
      <FeaturesSection
        title={language === 'pt' ? "Funcionalidades Kadeh Intelligence" : "Kadeh Intelligence Features"}
        subtitle={language === 'pt'
          ? "Todos os dados que você precisa para entender e servir melhor seus clientes."
          : "All the data you need to better understand and serve your customers."}
        features={features}
        columns={3}
      />

      {/* Benefícios */}
      <FeaturesSection
        title={language === 'pt' ? "Benefícios Comprovados" : "Proven Benefits"}
        subtitle={language === 'pt'
          ? "Transforme dados em decisões comerciais que aumentam vendas e satisfação."
          : "Transform data into business decisions that increase sales and satisfaction."}
        features={benefits}
        columns={3}
      />

      {/* Tipos de Relatórios */}
      <section className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {language === 'pt' ? "Relatórios Disponíveis" : "Available Reports"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'pt'
                ? "Seis tipos de relatórios complementares para análise completa do comportamento de clientes."
                : "Six types of complementary reports for complete analysis of customer behavior."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reportTypes.map((report, idx) => (
              <div key={idx} className="bg-white p-8 rounded-md border border-border hover:border-primary transition-colors">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {report.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {report.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">{language === 'pt' ? "Métricas incluídas:" : "Included metrics:"}</p>
                  <ul className="space-y-1">
                    {report.metrics.map((metric, midx) => (
                      <li key={midx} className="flex gap-2 text-muted-foreground text-sm">
                        <span className="text-primary">•</span>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <DataIntelligenceDashboard />

      {/* Heat Map */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {language === 'pt' ? "Heat Map de Navegação" : "Navigation Heat Map"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'pt'
                ? "Visualize o fluxo de clientes na sua loja com precisão de metro quadrado."
                : "Visualize customer flow in your store with square meter precision."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {heatmapBenefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Margin Analysis */}
      <MarginAnalysisByStore />

      {/* Category Performance Dashboard */}
      <section className="bg-slate-50 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <CategoryPerformanceDashboard />
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="bg-card py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {language === 'pt' ? "Recomendações Inteligentes com IA" : "Smart AI Recommendations"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'pt'
                ? "Agente de IA que aprende com padrões de comportamento e oferece recomendações personalizadas."
                : "AI agent that learns from behavior patterns and offers personalized recommendations."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiRecommendations.map((rec, idx) => (
              <div key={idx} className="bg-white p-8 rounded-md border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">{rec.title}</h3>
                <p className="text-muted-foreground">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        title={language === 'pt' ? "Perguntas Frequentes" : "Frequently Asked Questions"}
        items={faqItems}
      />

      {/* CTA Final */}
      <CTASection
        title={t.cta.title}
        subtitle={t.cta.description}
        primaryCTA={t.cta.talkToSpecialist}
      />

      <Footer />
    </>
  );
}

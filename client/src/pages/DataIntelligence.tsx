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
  const features = [
    {
      title: "Intenção de Compra em Tempo Real",
      description:
        "Identifique clientes com alta intenção de compra baseado em padrões de navegação e interação com produtos.",
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
      title: "Padrões de Busca de Produtos",
      description:
        "Analise quais produtos são mais buscados, em qual ordem e por quais categorias os clientes navegam.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: "Análise por Categoria",
      description:
        "Número de itens buscados por categoria, quantidade de buscas e profundidade de navegação.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: "Preferências de Marca",
      description:
        "Identifique quais marcas os clientes buscam mais, tendências de marca e preferências por tipo de produto.",
      icon: <Eye className="w-6 h-6" />,
    },
    {
      title: "Análise Temporal",
      description:
        "Dias da semana e do mês com maior utilização, horários de pico e padrões sazonais de busca.",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: "Heat Map de Navegação",
      description:
        "Visualize o mapa de calor da loja mostrando onde os clientes navegam mais e quais áreas recebem menos atenção.",
      icon: <MapPin className="w-6 h-6" />,
    },
  ];

  const benefits = [
    {
      title: "Decisões Baseadas em Dados Reais",
      description:
        "Elimine suposições com dados on-time de comportamento real dos clientes na sua loja.",
    },
    {
      title: "Otimização de Layout",
      description:
        "Use heat maps para reposicionar produtos e categorias onde os clientes realmente navegam.",
    },
    {
      title: "Aumento de Conversão",
      description:
        "Identifique clientes com alta intenção de compra e ofereça recomendações personalizadas em tempo real.",
    },
    {
      title: "Gestão de Estoque Inteligente",
      description:
        "Saiba quais produtos são mais buscados e ajuste estoque conforme demanda real de navegação.",
    },
    {
      title: "Personalização de Ofertas",
      description:
        "Recomende ofertas baseadas em padrões de busca e preferências individuais dos clientes.",
    },
    {
      title: "Análise Competitiva",
      description:
        "Compare preferências de marca e identifique oportunidades de ganho de market share.",
    },
  ];

  const reportTypes = [
    {
      title: "Dashboard On-Time",
      description:
        "Visualização em tempo real de todas as métricas de comportamento dos clientes na loja.",
      metrics: ["Clientes ativos", "Buscas em tempo real", "Intenção de compra", "Heat map live"],
    },
    {
      title: "Relatório de Intenção de Compra",
      description:
        "Identifique clientes com alta probabilidade de compra baseado em padrões de interação.",
      metrics: ["Score de intenção", "Produtos visualizados", "Tempo de permanência", "Ações tomadas"],
    },
    {
      title: "Análise de Padrões de Busca",
      description:
        "Entenda como os clientes buscam produtos e quais são os caminhos mais comuns de navegação.",
      metrics: ["Sequência de busca", "Categorias visitadas", "Produtos mais vistos", "Tempo por categoria"],
    },
    {
      title: "Relatório de Categorias",
      description:
        "Número de itens buscados por categoria, quantidade de buscas e profundidade de navegação.",
      metrics: ["Itens por categoria", "Buscas por categoria", "Profundidade", "Taxa de conversão"],
    },
    {
      title: "Análise de Marcas",
      description:
        "Quantidade de buscas por tipo de produto e marca, preferências e tendências.",
      metrics: ["Buscas por marca", "Buscas por tipo", "Preferência relativa", "Tendências"],
    },
    {
      title: "Análise Temporal",
      description:
        "Dias e horários de maior utilização, padrões semanais, mensais e sazonais.",
      metrics: ["Picos horários", "Dias de maior tráfego", "Padrões semanais", "Sazonalidade"],
    },
  ];

  const heatmapBenefits = [
    {
      title: "Visualizar Fluxo de Clientes",
      description:
        "Veja exatamente por onde os clientes navegam na loja e quais áreas recebem mais atenção.",
    },
    {
      title: "Identificar Zonas Mortas",
      description:
        "Descubra áreas da loja que recebem pouca atenção e otimize o layout para aumentar visibilidade.",
    },
    {
      title: "Otimizar Posicionamento de Produtos",
      description:
        "Coloque produtos de alta margem em áreas de alto tráfego identificadas no heat map.",
    },
    {
      title: "Melhorar Experiência de Navegação",
      description:
        "Entenda a jornada do cliente e remova barreiras que impedem acesso a categorias importantes.",
    },
  ];

  const aiRecommendations = [
    {
      title: "Recomendações Personalizadas",
      description:
        "O agente de IA sugere produtos baseado no histórico de busca e padrões de comportamento do cliente.",
    },
    {
      title: "Ofertas Inteligentes",
      description:
        "Recomende ofertas que aumentem a probabilidade de compra baseado em intenção detectada.",
    },
    {
      title: "Cross-Selling e Up-Selling",
      description:
        "Sugira produtos complementares e versões premium baseado em padrões de compra similares.",
    },
    {
      title: "Rastreamento de Cliques",
      description:
        "Monitore quais ofertas sugeridas os clientes clicam e ajuste recomendações em tempo real.",
    },
  ];

  const faqItems = [
    {
      question: "Os dados são coletados em tempo real?",
      answer:
        "Sim. O Kadeh Intelligence coleta e processa dados em tempo real, permitindo decisões imediatas baseadas no comportamento atual dos clientes.",
    },
    {
      question: "Como funciona a detecção de intenção de compra?",
      answer:
        "O sistema analisa padrões de navegação, tempo de permanência em categorias, visualizações de produtos e interações com ofertas para calcular um score de intenção de compra.",
    },
    {
      question: "O heat map mostra movimento de clientes específicos?",
      answer:
        "O heat map é agregado e anônimo, mostrando padrões gerais de navegação sem identificar indivíduos, garantindo privacidade.",
    },
    {
      question: "Posso exportar os relatórios?",
      answer:
        "Sim. Todos os relatórios podem ser exportados em PDF, Excel ou integrados com ferramentas de BI como Power BI e Tableau.",
    },
    {
      question: "Qual é a latência dos dados?",
      answer:
        "Dados são processados com latência de menos de 1 segundo, permitindo análises e recomendações verdadeiramente em tempo real.",
    },
    {
      question: "Como os dados são armazenados e protegidos?",
      answer:
        "Todos os dados estão em conformidade com LGPD, criptografados em trânsito e em repouso, com backup automático e acesso controlado.",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <Hero
        title="Kadeh Intelligence: dados on-time sobre comportamento de clientes para decisões comerciais inteligentes."
        subtitle="Relatórios em tempo real de intenção de compra, padrões de busca, heat maps de navegação e análises detalhadas de categorias, marcas e horários de pico."
        primaryCTA="Solicitar demonstração"
        secondaryCTA="Ver relatórios"
        imageUrl="/images/data-analytics-retail.png"
        imageAlt="Inteligência de Dados - Dashboard Analytics"
      />

      {/* Funcionalidades */}
      <FeaturesSection
        title="Funcionalidades Kadeh Intelligence"
        subtitle="Todos os dados que você precisa para entender e servir melhor seus clientes."
        features={features}
        columns={3}
      />

      {/* Benefícios */}
      <FeaturesSection
        title="Benefícios Comprovados"
        subtitle="Transforme dados em decisões comerciais que aumentam vendas e satisfação."
        features={benefits}
        columns={3}
      />

      {/* Tipos de Relatórios */}
      <section className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Relatórios Disponíveis
            </h2>
            <p className="text-lg text-muted-foreground">
              Seis tipos de relatórios complementares para análise completa do comportamento de clientes.
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
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Métricas incluídas:</p>
                  <ul className="space-y-1">
                    {report.metrics.map((metric, midx) => (
                      <li key={midx} className="text-xs text-muted-foreground flex gap-2">
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

      {/* Heat Map Section */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Heat Map: Visualize o Fluxo de Clientes
            </h2>
            <p className="text-lg text-muted-foreground">
              Mapa de calor em tempo real mostrando onde os clientes navegam mais na sua loja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-8 rounded-md border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">O que o Heat Map Mostra</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5"></div>
                  <div>
                    <p className="font-medium text-foreground">Áreas de Alto Tráfego (Vermelho)</p>
                    <p className="text-sm text-muted-foreground">Regiões onde clientes navegam mais frequentemente</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5"></div>
                  <div>
                    <p className="font-medium text-foreground">Tráfego Moderado (Laranja)</p>
                    <p className="text-sm text-muted-foreground">Áreas com navegação média</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0 mt-1.5"></div>
                  <div>
                    <p className="font-medium text-foreground">Tráfego Baixo (Amarelo)</p>
                    <p className="text-sm text-muted-foreground">Áreas com pouca navegação</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>
                  <div>
                    <p className="font-medium text-foreground">Sem Tráfego (Azul)</p>
                    <p className="text-sm text-muted-foreground">Zonas mortas sem navegação</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              {heatmapBenefits.map((benefit, idx) => (
                <div key={idx} className="bg-card p-6 rounded-md border border-border">
                  <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IA Recommendations */}
      <section className="bg-card py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Recomendações Inteligentes do Agente de IA
            </h2>
            <p className="text-lg text-muted-foreground">
              O agente de IA do Kadeh sugere ofertas e produtos personalizados em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiRecommendations.map((rec, idx) => (
              <div key={idx} className="bg-white p-8 rounded-md border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {rec.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {rec.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-white rounded-md border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">Rastreamento de Cliques em Ofertas</h3>
            <p className="text-muted-foreground mb-6">
              O Kadeh Intelligence rastreia cada clique em ofertas sugeridas pelo agente de IA, permitindo:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <span className="text-primary font-bold">1.</span>
                <div>
                  <p className="font-medium text-foreground">Medir Efetividade</p>
                  <p className="text-sm text-muted-foreground">Veja qual % de clientes clicam em cada oferta</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold">2.</span>
                <div>
                  <p className="font-medium text-foreground">Otimizar Recomendações</p>
                  <p className="text-sm text-muted-foreground">Ajuste ofertas em tempo real baseado em performance</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold">3.</span>
                <div>
                  <p className="font-medium text-foreground">Análise de Conversão</p>
                  <p className="text-sm text-muted-foreground">Rastreie de clique até compra final</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold">4.</span>
                <div>
                  <p className="font-medium text-foreground">Personalização Contínua</p>
                  <p className="text-sm text-muted-foreground">Machine learning melhora recomendações diariamente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">
            Resultados Esperados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+25%</div>
              <p className="text-muted-foreground">Aumento de Conversão</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-40%</div>
              <p className="text-muted-foreground">Redução de Estoque Parado</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+35%</div>
              <p className="text-muted-foreground">Aumento de Ticket Médio</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">&lt;1s</div>
              <p className="text-muted-foreground">Latência de Dados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Interativo */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Dashboard On-Time: Visualize Dados em Tempo Real
            </h2>
            <p className="text-lg text-muted-foreground">
              Acompanhe métricas, padrões de busca, heat map e intenção de compra em tempo real.
            </p>
          </div>
          <DataIntelligenceDashboard />
        </div>
      </section>

      {/* Análise de Margens por Loja */}
      <section className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Análise de Margens por Loja: Decisões Estratégicas em Tempo Real
            </h2>
            <p className="text-lg text-muted-foreground">
              Conheça as margens de cada categoria em suas lojas ou grupos de lojas. Compare desempenho, identifique oportunidades e tome decisões baseadas em dados.
            </p>
          </div>
          <MarginAnalysisByStore />
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        id="faq"
        title="Perguntas Frequentes"
        items={faqItems}
      />

      {/* CTA Final */}
      <CTASection
        title="Transforme dados em decisões que aumentam vendas."
        subtitle="Kadeh Intelligence fornece insights on-time para otimizar sua operação de varejo."
        primaryCTA="Solicitar demonstração"
        secondaryCTA="Falar com especialista"
      />

      <Footer />
    </>
  );
}

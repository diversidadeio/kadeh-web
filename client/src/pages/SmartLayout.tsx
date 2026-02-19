/**
 * Smart Layout Page — Kadeh Smart Layout
 * Design: Tech-Forward Minimalism
 * SEO: Optimized for retail, category management, shelf optimization keywords
 */

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SmartLayoutSimulator from "@/components/SmartLayoutSimulator";
import TopCategoriesSection from "@/components/TopCategoriesSection";
import {
  BarChart3,
  Zap,
  TrendingUp,
  Package,
  Layout,
  Target,
  DollarSign,
  Eye,
  Layers,
} from "lucide-react";

export default function SmartLayout() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    // Scroll to simulator
    const simulatorSection = document.querySelector('[data-simulator-section]');
    if (simulatorSection) {
      simulatorSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Trigger add product in simulator (will be handled by SmartLayoutSimulator)
    window.dispatchEvent(new CustomEvent('addCategoryToSimulator', { detail: { categoryId, categoryName } }));
  };

  const features = [
    {
      title: "Análise de Mix de Produtos",
      description:
        "Visualize o portfólio completo de categorias com informações de giro, margem e volume de vendas.",
      icon: <Package className="w-6 h-6" />,
    },
    {
      title: "Recomendação Inteligente de Posições",
      description:
        "Sistema recomenda o número ideal de posições por produto baseado em giro e margem de lucratividade.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: "Otimização de Posicionamento",
      description:
        "Produtos posicionados automaticamente por zona (olhos, mãos, piso) para maximizar conversão.",
      icon: <Eye className="w-6 h-6" />,
    },
    {
      title: "Redimensionamento de Categorias",
      description:
        "Recomendações de aumento/redução de espaço de categoria para melhorar lucratividade total.",
      icon: <Layout className="w-6 h-6" />,
    },
    {
      title: "Gestão de Gôndolas",
      description:
        "Defina dimensões de gôndolas, número de prateleiras e largura disponível para cálculos precisos.",
      icon: <Layers className="w-6 h-6" />,
    },
    {
      title: "Relatórios de Performance",
      description:
        "Análise detalhada de impacto de cada categoria na lucratividade total da loja.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  const benefits = [
    {
      title: "Aumento de Lucratividade",
      description:
        "Produtos de alta margem ganham mais espaço e melhor posicionamento, aumentando ticket médio.",
    },
    {
      title: "Otimização de Espaço",
      description:
        "Cada centímetro de gôndola trabalha para você, eliminando desperdício e maximizando ROI.",
    },
    {
      title: "Redução de Ruptura",
      description:
        "Produtos com alto giro recebem mais posições, reduzindo falta de estoque e perda de vendas.",
    },
    {
      title: "Melhor Experiência do Cliente",
      description:
        "Produtos mais procurados ficam em melhor posição, facilitando localização e aumentando satisfação.",
    },
    {
      title: "Decisões Baseadas em Dados",
      description:
        "Elimine suposições: cada recomendação é baseada em análise matemática de giro e margem.",
    },
    {
      title: "Implementação Rápida",
      description:
        "Recomendações prontas para implementação imediata, sem necessidade de consultoria externa.",
    },
  ];

  const howItWorks = [
    {
      title: "Cadastre Categorias",
      description:
        "Informe mix de produtos, margem de lucratividade (baixa, média, alta) e giro de mercadoria.",
    },
    {
      title: "Configure Gôndolas",
      description:
        "Defina dimensões da gôndola, número de prateleiras e largura disponível por categoria.",
    },
    {
      title: "Sistema Recomenda",
      description:
        "Kadeh Smart Layout calcula número ideal de posições e posicionamento por zona de gôndola.",
    },
    {
      title: "Implemente",
      description:
        "Receba planograma detalhado e implemente recomendações na loja física.",
    },
    {
      title: "Acompanhe Resultados",
      description:
        "Monitore impacto nas vendas e lucratividade, ajuste conforme necessário.",
    },
  ];

  const matrix = [
    {
      giro: "Alto",
      margem: "Alta",
      quadrantes: 1,
      zone: "Altura dos olhos",
      share: "35%",
      color: "bg-green-600",
      label: "Maior espaço",
    },
    {
      giro: "Alto",
      margem: "Média",
      quadrantes: 2,
      zone: "Altura dos olhos",
      share: "25%",
      color: "bg-green-500",
      label: "Melhor espaço",
    },
    {
      giro: "Alto",
      margem: "Baixa",
      quadrantes: 2,
      zone: "Altura das mãos",
      share: "20%",
      color: "bg-yellow-500",
      label: "Bom espaço",
    },
    {
      giro: "Médio",
      margem: "Alta",
      quadrantes: 2,
      zone: "Altura dos olhos",
      share: "25%",
      color: "bg-green-500",
      label: "Melhor espaço",
    },
    {
      giro: "Médio",
      margem: "Média",
      quadrantes: 3,
      zone: "Altura das mãos",
      share: "20%",
      color: "bg-yellow-500",
      label: "Bom espaço",
    },
    {
      giro: "Médio",
      margem: "Baixa",
      quadrantes: 4,
      zone: "Altura das mãos",
      share: "15%",
      color: "bg-orange-400",
      label: "Pequeno espaço",
    },
    {
      giro: "Baixo",
      margem: "Alta",
      quadrantes: 3,
      zone: "Altura das mãos",
      share: "20%",
      color: "bg-yellow-500",
      label: "Bom espaço",
    },
    {
      giro: "Baixo",
      margem: "Média",
      quadrantes: 4,
      zone: "Altura das mãos",
      share: "15%",
      color: "bg-orange-400",
      label: "Pequeno espaço",
    },
    {
      giro: "Baixo",
      margem: "Baixa",
      quadrantes: 5,
      zone: "Lugar baixo",
      share: "5%",
      color: "bg-red-400",
      label: "Menor espaço",
    },
  ];

  const useCases = [
    {
      title: "Varejo Alimentar",
      description:
        "Otimize categorias de alimentos, bebidas e produtos de giro rápido com recomendações por sazonalidade.",
    },
    {
      title: "Varejo Geral",
      description:
        "Gerencie múltiplas categorias (vestuário, eletrônicos, higiene) com diferentes margens e giros.",
    },
    {
      title: "Farmácia",
      description:
        "Maximize lucratividade de medicamentos, cosméticos e produtos de saúde com posicionamento estratégico.",
    },
    {
      title: "Petshop",
      description:
        "Otimize espaço de rações, brinquedos e acessórios com recomendações baseadas em sazonalidade.",
    },
  ];

  const faqItems = [
    {
      question: "Como o sistema calcula o número de posições recomendado?",
      answer:
        "O sistema usa uma matriz matemática que cruza Giro (Baixo/Médio/Alto) com Margem (Baixa/Média/Alta), recomendando de 1 a 5 posições. Produtos com alto giro e alta margem recebem mais espaço.",
    },
    {
      question: "Posso customizar as recomendações?",
      answer:
        "Sim. Você pode ajustar manualmente as recomendações do sistema conforme sua estratégia comercial e conhecimento do ponto de venda.",
    },
    {
      question: "Como funciona o redimensionamento de categorias?",
      answer:
        "O sistema analisa lucratividade por categoria e recomenda aumento ou redução de espaço para maximizar retorno total da loja.",
    },
    {
      question: "Quais informações preciso fornecer para começar?",
      answer:
        "Você precisa informar: mix de produtos por categoria, margem de lucratividade, giro de mercadoria, dimensões das gôndolas e número de prateleiras.",
    },
    {
      question: "O sistema integra com meu ERP/PDV?",
      answer:
        "Sim. Kadeh Smart Layout integra com sistemas ERP e PDV para importar dados de giro, preço e estoque automaticamente.",
    },
    {
      question: "Quanto tempo leva para ver resultados?",
      answer:
        "Resultados são visíveis em 2-4 semanas após implementação das recomendações, com aumento de 5-15% na lucratividade média.",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <Hero
        title="Kadeh Smart Layout: gerencie categorias com inteligência e maximize a lucratividade da loja."
        subtitle="Recomendações automáticas de número de posições, posicionamento em gôndola e redimensionamento de categorias baseadas em mix de produtos, margem de lucratividade e giro de mercadoria."
        primaryCTA="Solicitar demonstração"
        secondaryCTA="Ver funcionalidades"
        imageUrl="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/avplhLfFmhYRDhTs.png"
        imageAlt="Smart Layout - Otimização de Gôndolas"
      />

      {/* Funcionalidades */}
      <FeaturesSection
        title="Funcionalidades Kadeh Smart Layout"
        subtitle="Tudo que você precisa para gerenciar categorias com eficiência e lucratividade."
        features={features}
        columns={3}
      />

      {/* Benefícios */}
      <FeaturesSection
        title="Benefícios Comprovados"
        subtitle="Resultados mensuráveis para sua operação de varejo."
        features={benefits}
        columns={3}
      />

      {/* Como Funciona */}
      <section className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Do cadastro à implementação: 5 passos simples
            </h2>
            <p className="text-lg text-muted-foreground">
              Processo direto para otimizar suas categorias e aumentar lucratividade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemplos de Gôndolas */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Exemplos Práticos de Otimização
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            Veja como o Kadeh Smart Layout otimiza diferentes cenários de gôndola.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gondola */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: '/images/smart-layout-gondola.png', alt: "Visualização de Gôndola" })}>
              <img src="/images/smart-layout-gondola.png" alt="Visualização de Gôndola" className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  Visualização de Gôndola
                </h3>
                <p className="text-sm text-muted-foreground">
                  Estrutura básica de gôndola com distribuição de espaço por categoria.
                </p>
              </div>
            </div>

            {/* Retail */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: '/images/smart-layout-retail.png', alt: "Cenário de Varejo" })}>
              <img src="/images/smart-layout-retail.png" alt="Cenário de Varejo" className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  Cenário de Varejo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Otimização completa de gôndola em ambiente de varejo real.
                </p>
              </div>
            </div>

            {/* Olive Oil */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/avplhLfFmhYRDhTs.png', alt: "Exemplo com Azeite" })}>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/avplhLfFmhYRDhTs.png" alt="Exemplo com Azeite" className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  Exemplo com Azeite
                </h3>
                <p className="text-sm text-muted-foreground">
                  Otimização de categoria de azeites com 4 variações de margem e giro.
                </p>
              </div>
            </div>

            {/* Detailed */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/GPUaxCFmQgNVKOZv.png', alt: "Versão Detalhada" })}>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/GPUaxCFmQgNVKOZv.png" alt="Versão Detalhada" className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  Versão Detalhada
                </h3>
                <p className="text-sm text-muted-foreground">
                  Análise detalhada com informações de preço, giro e posicionamento.
                </p>
              </div>
            </div>

            {/* 6 Shelves */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/wjSnHdHtumNCqHrQ.png', alt: "Versão com 4 Prateleiras" })}>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/wjSnHdHtumNCqHrQ.png" alt="Versão com 4 Prateleiras" className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  Versão com 4 Prateleiras
                </h3>
                <p className="text-sm text-muted-foreground">
                  Otimização para gôndolas com 4 prateleiras e maior espaço disponível.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matriz de Recomendação */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Matriz de Recomendação Inteligente
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            Sistema recomenda número de quadrantes e posicionamento baseado em Giro × Margem de Lucratividade.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Giro</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Margem</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Quadrante</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Posição</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">% Espaço</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Categoria</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-card transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{row.giro}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{row.margem}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${row.color} text-white font-bold text-sm`}>
                        {row.quadrantes}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.zone}</td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">{row.share}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-card rounded-md border border-border">
            <h3 className="font-semibold text-foreground mb-3">Legenda de Posicionamento:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-green-600 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-medium text-foreground">Maior espaço (35%)</p>
                  <p className="text-muted-foreground">Altura dos olhos - Produtos premium</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-medium text-foreground">Bom espaço (20%)</p>
                  <p className="text-muted-foreground">Altura das mãos - Produtos balanceados</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-orange-400 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-medium text-foreground">Pequeno espaço (15%)</p>
                  <p className="text-muted-foreground">Altura das mãos - Produtos secundários</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-red-400 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-medium text-foreground">Menor espaço (5%)</p>
                  <p className="text-muted-foreground">Lugar baixo - Produtos lentos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="bg-card py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12">
            Aplicável a Todos os Formatos de Varejo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="p-8 bg-white border border-border rounded-md hover:border-primary transition-colors">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
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
              <div className="text-4xl font-bold text-primary mb-2">+5-15%</div>
              <p className="text-muted-foreground">Aumento de Lucratividade</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-20%</div>
              <p className="text-muted-foreground">Redução de Ruptura</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+30%</div>
              <p className="text-muted-foreground">Melhor Uso de Espaço</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2-4w</div>
              <p className="text-muted-foreground">Tempo para Resultados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categorias */}
      <section className="bg-card py-20 lg:py-32 border-t border-border">
        <div className="container">
          <TopCategoriesSection onCategorySelect={handleCategorySelect} />
        </div>
      </section>

      {/* Simulador Interativo */}
      <section className="bg-white py-20 lg:py-32 border-t border-border" data-simulator-section>
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Teste o Smart Layout: Simulador Interativo
            </h2>
            <p className="text-lg text-muted-foreground">
              Configure sua gôndola, adicione produtos e veja as recomendações de layout em tempo real.
            </p>
          </div>
          <SmartLayoutSimulator />
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
        title="Transforme seu gerenciamento de categorias em vantagem competitiva."
        subtitle="Kadeh Smart Layout recomenda, você implementa, e a lucratividade cresce."
        primaryCTA="Solicitar demonstração"
        secondaryCTA="Falar com especialista"
      />

      <Footer />
    </>
  );
}
